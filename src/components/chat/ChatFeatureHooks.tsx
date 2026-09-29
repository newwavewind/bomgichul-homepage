"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TopicRoomRow, UserChatPrefs } from "@/types/database";
import { formatGoalBadge } from "@/lib/chat/features";

function kstDateString(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const DEFAULT_PREFS: Omit<UserChatPrefs, "user_id"> = {
  keyword_alerts: [],
  daily_goal_count: 40,
  daily_done_count: 0,
  daily_done_on: null,
};

export function useChatPrefs(userId: string | null) {
  const [prefs, setPrefs] = useState<UserChatPrefs | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("user_chat_prefs")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setPrefs(data as UserChatPrefs);
    else {
      const row = { user_id: userId, ...DEFAULT_PREFS };
      await supabase.from("user_chat_prefs").upsert(row);
      setPrefs(row);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (patch: Partial<UserChatPrefs>) => {
      if (!userId) return;
      const next = { ...(prefs ?? { user_id: userId, ...DEFAULT_PREFS }), ...patch };
      setPrefs(next);
      await createClient().from("user_chat_prefs").upsert({
        ...next,
        updated_at: new Date().toISOString(),
      });
    },
    [prefs, userId],
  );

  const bumpDailyDone = useCallback(async () => {
    if (!userId || !prefs) return;
    const today = kstDateString();
    const base =
      prefs.daily_done_on === today ? prefs.daily_done_count : 0;
    await save({
      daily_done_count: base + 1,
      daily_done_on: today,
    });
  }, [prefs, save, userId]);

  const doneToday =
    prefs && prefs.daily_done_on === kstDateString()
      ? prefs.daily_done_count
      : 0;
  const goalCount = prefs?.daily_goal_count ?? 40;
  const goalLabel = formatGoalBadge(doneToday, goalCount);

  return {
    prefs,
    refresh,
    save,
    bumpDailyDone,
    goalLabel,
    doneToday,
    goalCount,
  };
}

export function useTopicRooms(enabled: boolean) {
  const [rooms, setRooms] = useState<TopicRoomRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await createClient().rpc("list_topic_rooms");
    if (!error && data) setRooms(data as TopicRoomRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (enabled) void refresh();
  }, [enabled, refresh]);

  const join = useCallback(
    async (topicKey: string) => {
      const { data, error } = await createClient().rpc("join_topic_room", {
        p_topic_key: topicKey,
      });
      if (error) throw error;
      await refresh();
      return data as string;
    },
    [refresh],
  );

  return { rooms, loading, refresh, join };
}

export function ChatPrefsBar({
  doneToday,
  goalCount,
  keywords,
  onOpenKeywords,
  onBumpDone,
}: {
  doneToday: number;
  goalCount: number;
  keywords: string[];
  onOpenKeywords: () => void;
  onBumpDone: () => void;
}) {
  const pct = goalCount > 0 ? Math.min(100, Math.round((doneToday / goalCount) * 100)) : 0;

  return (
    <div className="flex items-center gap-2 border-b border-mist/70 bg-white/50 px-3 py-2.5">
      <button
        type="button"
        onClick={onBumpDone}
        title="오늘 푼 문항 +1"
        className="chat-focus min-w-0 flex-1 rounded-xl border border-mist bg-white px-3 py-2 text-left transition-colors hover:border-[#007AFF]/35"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-[11px] font-medium text-smoke">
            오늘 목표
          </span>
          <span className="font-display text-[12px] font-semibold tabular-nums text-ink">
            {doneToday}
            <span className="font-normal text-fog"> / {goalCount}</span>
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#007AFF] transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>
      <button
        type="button"
        onClick={onOpenKeywords}
        className="chat-focus shrink-0 rounded-xl border border-mist bg-white px-3 py-2 font-display text-[11px] font-medium text-smoke transition-colors hover:border-[#007AFF]/35 hover:text-ink"
      >
        키워드{keywords.length ? ` ${keywords.length}` : ""}
      </button>
    </div>
  );
}
