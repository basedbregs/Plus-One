import WingmanBoard from "@/components/WingmanBoard";
import { currentUserId, wingmanRequestsSeed } from "@/lib/mockData";

export const metadata = { title: "Wingman · Plus One" };

export default function WingmanPage({
  searchParams,
}: {
  searchParams: { compose?: string };
}) {
  return (
    <WingmanBoard
      initial={wingmanRequestsSeed}
      currentUserId={currentUserId}
      openComposer={searchParams?.compose === "1"}
    />
  );
}
