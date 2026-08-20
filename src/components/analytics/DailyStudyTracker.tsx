"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function DailyStudyTracker({ userId }: { userId: string }) {
  useEffect(() => {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
    const key = `bomgichul:study-day:${userId}:${date}`;
    if (window.localStorage.getItem(key)) return;
    void createClient().rpc("record_daily_login").then(({ error }) => {
      if (!error) window.localStorage.setItem(key, "1");
    });
  }, [userId]);
  return null;
}
