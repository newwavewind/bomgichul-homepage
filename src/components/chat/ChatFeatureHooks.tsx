"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TopicRoomRow, UserChatPrefs } from "@/types/database";
import { formatGoalBadge } from "@/lib/chat/features";

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
    const today = new Date().toISOString().slice(0, 10);
    const base =
      prefs.daily_done_on === today ? prefs.daily_done_count : 0;
    await save({
      daily_done_count: base + 1,
      daily_done_on: today,
    });
  }, [prefs, save, userId]);

  const goalLabel = prefs
    ? formatGoalBadge(
        prefs.daily_done_on === new Date().toISOString().slice(0, 10)
          ? prefs.daily_done_count
          : 0,
        prefs.daily_goal_count,
      )
    : "오늘 0/40";

  return { prefs, refresh, save, bumpDailyDone, goalLabel };
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
  goalLabel,
  keywords,
  onSaveKeywords,
  onBumpDone,
}: {
  goalLabel: string;
  keywords: string[];
  onSaveKeywords: (raw: string) => void;
  onBumpDone: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-mist/70 bg-white/50 px-3 py-2">
      <button
        type="button"
        onClick={onBumpDone}
        className="rounded-full bg-[#007AFF]/10 px-2.5 py-1 font-display text-[11px] font-semibold text-[#0066D6]"
        title="오늘 푼 문항 +1"
      >
        {goalLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          const raw = window.prompt(
            "키워드 알림 (쉼표로 구분)",
            keywords.join(", "),
          );
          if (raw != null) onSaveKeywords(raw);
        }}
        className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-fog"
      >
        키워드 {keywords.length ? `(${keywords.length})` : ""}
      </button>
    </div>
  );
}
