import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ unreadCount: 0 });
  }

  const unreadCount = await getUnreadNotificationCount(user.id);
  return NextResponse.json({ unreadCount });
}
