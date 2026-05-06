// Supabase Edge Function: scrape-facebook-events
// Runs daily to scrape Facebook Events for Downtown Knoxville & UTK Campus
// via the Apify Facebook Events Scraper, then upserts into the events table.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ApifyEvent {
  id?: string;
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  url?: string;
  coverPhoto?: { uri?: string };
  location?: {
    name?: string;
    city?: string;
    state?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  eventCreator?: { name?: string };
  category?: string;
}

// Knoxville bounding box — only keep events inside Downtown + UTK
const KNX_BOUNDS = {
  minLat: 35.945,
  maxLat: 35.985,
  minLng: -83.955,
  maxLng: -83.895,
};

// Map free-text categories from Facebook to our enum
function mapCategory(raw?: string, name?: string, desc?: string): string {
  const text = `${raw ?? ''} ${name ?? ''} ${desc ?? ''}`.toLowerCase();
  if (/concert|music|band|dj|live.*show|acoustic/.test(text)) return 'music';
  if (/football|basketball|game|match|tailgate|vols/.test(text)) return 'sports';
  if (/comedy|standup|improv/.test(text)) return 'comedy';
  if (/festival|fair|parade/.test(text)) return 'festival';
  if (/study|lecture|class|workshop|seminar/.test(text)) return 'study';
  if (/art|gallery|exhibit|theatre|theater/.test(text)) return 'arts';
  if (/food|restaurant|tasting|dinner|brunch/.test(text)) return 'food';
  if (/bar|club|nightlife|party/.test(text)) return 'nightlife';
  if (/campus|utk|student|greek/.test(text)) return 'campus';
  return 'other';
}

Deno.serve(async (req) => {
  const APIFY_TOKEN = Deno.env.get('APIFY_API_TOKEN');
  if (!APIFY_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'APIFY_API_TOKEN not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Run the Apify actor synchronously and get dataset items back
  const apifyUrl =
    `https://api.apify.com/v2/acts/apify~facebook-events-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  const input = {
    searchQueries: [
      'Knoxville TN',
      'Downtown Knoxville',
      'UTK Knoxville',
      'Market Square Knoxville',
      'Old City Knoxville',
    ],
    startUrls: [],
    maxEvents: 100,
  };

  const apifyRes = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!apifyRes.ok) {
    const text = await apifyRes.text();
    return new Response(
      JSON.stringify({ error: 'Apify request failed', status: apifyRes.status, body: text }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const events: ApifyEvent[] = await apifyRes.json();

  let inserted = 0;
  let skippedOutOfBounds = 0;
  let skippedIncomplete = 0;
  let errors = 0;

  for (const ev of events) {
    if (!ev.name || !ev.startTime || !ev.location?.latitude || !ev.location?.longitude) {
      skippedIncomplete++;
      continue;
    }

    const lat = ev.location.latitude;
    const lng = ev.location.longitude;

    // Geofence to Knoxville zone
    if (
      lat < KNX_BOUNDS.minLat || lat > KNX_BOUNDS.maxLat ||
      lng < KNX_BOUNDS.minLng || lng > KNX_BOUNDS.maxLng
    ) {
      skippedOutOfBounds++;
      continue;
    }

    // Deduplicate on source_url
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('source_url', ev.url ?? '')
      .limit(1)
      .maybeSingle();

    if (existing) continue;

    const address = [
      ev.location.name,
      ev.location.address,
      ev.location.city,
      ev.location.state,
    ].filter(Boolean).join(', ');

    const { error } = await supabase.from('events').insert({
      title: ev.name.slice(0, 200),
      description: ev.description?.slice(0, 2000) ?? null,
      source: 'facebook',
      source_url: ev.url,
      start_time: ev.startTime,
      end_time: ev.endTime ?? null,
      category: mapCategory(ev.category, ev.name, ev.description) as any,
      location: `POINT(${lng} ${lat})`,
      address: address || 'Knoxville, TN',
      image_url: ev.coverPhoto?.uri ?? null,
      is_crowd_sourced: false,
      status: 'active',
    });

    if (error) {
      console.error('Insert error:', error.message);
      errors++;
    } else {
      inserted++;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      total_scraped: events.length,
      inserted,
      skipped_out_of_bounds: skippedOutOfBounds,
      skipped_incomplete: skippedIncomplete,
      errors,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
