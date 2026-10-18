import type { Metadata } from "next";
import {
  CommunityPostDetailPage,
  generateMetadata as generateCommunityPostMetadata,
} from "@/app/community/[id]/page";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateCommunityPostMetadata(props);
}

export default async function Page({ params }: Props) {
  return <CommunityPostDetailPage params={params} expectedScope="gamjeong" />;
}
