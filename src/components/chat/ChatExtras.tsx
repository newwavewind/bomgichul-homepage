"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatKstChatTime } from "@/lib/datetime";

export type SearchHit = {
  id: string;
  conversation_id: string;
  conversation_title: string;
  sender_id: string;
  sender_nickname: string;
  content: string;
  created_at: string;
  message_kind: string;
};

export type MediaRow = {
  id: string;
  message_id: string;
  kind: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  signed_url?: string;
};

export type StudyEventRow = {
  id: string;
  conversation_id: string;
  kind: string;
  title: string;
  due_at: string | null;
  weekday: number | null;
  time_of_day: string | null;
  recurrence: string | null;
};

export function ChatGlobalSearch({
  onOpenConversation,
  initialQuery = "",
}: {
  onOpenConversation: (conversationId: string) => void;
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) setQ(initialQuery);
  }, [initialQuery]);

  const run = useCallback(async () => {
    const query = q.trim();
    if (query.length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: searchError } = await createClient().rpc(
      "search_dm_messages",
      { p_query: query, p_limit: 40 },
    );
    if (searchError) setError(searchError.message);
    else setHits((data ?? []) as SearchHit[]);
    setLoading(false);
  }, [q]);

  useEffect(() => {
    const t = window.setTimeout(() => void run(), 280);
    return () => window.clearTimeout(t);
  }, [run]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-mist/70 p-3">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="모든 대화에서 검색"
          className="w-full rounded-xl border border-mist bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#007AFF]"
        />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {error ? (
          <p className="text-[12px] text-rose-600">{error}</p>
        ) : null}
        {loading ? (
          <p className="py-8 text-center text-[13px] text-fog">검색 중…</p>
        ) : hits.length ? (
          hits.map((hit) => (
            <button
              key={hit.id}
              type="button"
              onClick={() => onOpenConversation(hit.conversation_id)}
              className="block w-full rounded-2xl border border-white bg-white/80 p-3 text-left shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <b className="truncate text-[12px] text-ink">
                  {hit.conversation_title}
                </b>
                <small className="shrink-0 text-[10px] text-fog">
                  {formatKstChatTime(hit.created_at)}
                </small>
              </div>
              <p className="mt-1 text-[11px] text-fog">{hit.sender_nickname}</p>
              <p className="mt-1 line-clamp-2 text-[12px] text-smoke">
                {hit.content}
              </p>
            </button>
          ))
        ) : q.trim().length >= 2 ? (
          <p className="py-8 text-center text-[13px] text-fog">검색 결과가 없어요.</p>
        ) : (
          <p className="py-8 text-center text-[13px] text-fog">
            두 글자 이상 입력하세요.
          </p>
        )}
      </div>
    </div>
  );
}

export function ChatMediaGallery({ conversationId }: { conversationId: string }) {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase.rpc("list_dm_room_media", {
        p_conversation_id: conversationId,
        p_limit: 80,
      });
      const list = (data ?? []) as MediaRow[];
      if (list.length) {
        const { data: signed } = await supabase.storage
          .from("chat-media")
          .createSignedUrls(
            list.map((r) => r.file_path),
            3600,
          );
        const urls = Object.fromEntries(
          (signed ?? []).map((s) => [s.path, s.signedUrl]),
        );
        for (const row of list) row.signed_url = urls[row.file_path];
      }
      if (alive) {
        setRows(list);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [conversationId]);

  if (loading) {
    return <p className="py-10 text-center text-[13px] text-fog">불러오는 중…</p>;
  }
  if (!rows.length) {
    return (
      <p className="py-10 text-center text-[13px] text-fog">
        사진·동영상·음성이 아직 없어요.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 overflow-y-auto p-3">
      {rows.map((row) =>
        row.kind === "image" ? (
          <a
            key={row.id}
            href={row.signed_url}
            target="_blank"
            rel="noreferrer"
            className="aspect-square overflow-hidden rounded-xl bg-ice"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.signed_url}
              alt={row.file_name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </a>
        ) : row.kind === "video" ? (
          <video
            key={row.id}
            src={row.signed_url}
            controls
            playsInline
            className="aspect-square w-full rounded-xl bg-black object-cover"
          />
        ) : (
          <div
            key={row.id}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-mist bg-white p-2"
          >
            <span className="text-lg">🎙</span>
            <audio src={row.signed_url} controls preload="metadata" className="w-full" />
          </div>
        ),
      )}
    </div>
  );
}

function kstYmd(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function ChatStudyCalendar({
  conversationId,
}: {
  conversationId: string | null;
}) {
  const [events, setEvents] = useState<StudyEventRow[]>([]);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      let query = supabase
        .from("chat_study_events")
        .select("id,conversation_id,kind,title,due_at,weekday,time_of_day,recurrence")
        .in("kind", ["schedule", "weekly", "goal", "notice"])
        .order("due_at", { ascending: true })
        .limit(120);
      if (conversationId) query = query.eq("conversation_id", conversationId);
      const { data } = await query;
      if (alive) setEvents((data ?? []) as StudyEventRow[]);
    })();
    return () => {
      alive = false;
    };
  }, [conversationId]);

  const monthLabel = `${cursor.getFullYear()}.${String(cursor.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();
  const startPad = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();

  const byDay = useMemo(() => {
    const map = new Map<string, StudyEventRow[]>();
    for (const ev of events) {
      if (ev.due_at) {
        const key = kstYmd(new Date(ev.due_at));
        const list = map.get(key) ?? [];
        list.push(ev);
        map.set(key, list);
      }
      if (ev.recurrence === "weekly" && ev.weekday != null) {
        for (let day = 1; day <= daysInMonth; day++) {
          const dt = new Date(cursor.getFullYear(), cursor.getMonth(), day);
          if (dt.getDay() === ev.weekday) {
            const key = kstYmd(dt);
            const list = map.get(key) ?? [];
            if (!list.some((x) => x.id === ev.id)) list.push(ev);
            map.set(key, list);
          }
        }
      }
    }
    return map;
  }, [events, cursor, daysInMonth]);

  const cells: Array<number | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="rounded-full bg-white px-3 py-1 text-[12px] shadow-sm"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
        >
          ←
        </button>
        <h3 className="font-display text-[14px] font-semibold text-ink">
          {monthLabel} 스터디 일정
        </h3>
        <button
          type="button"
          className="rounded-full bg-white px-3 py-1 text-[12px] shadow-sm"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-fog">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key = kstYmd(
            new Date(cursor.getFullYear(), cursor.getMonth(), day),
          );
          const list = byDay.get(key) ?? [];
          return (
            <div
              key={key}
              className={`min-h-[64px] rounded-xl border p-1 ${
                list.length
                  ? "border-[#007AFF]/25 bg-[#007AFF]/5"
                  : "border-mist/60 bg-white/50"
              }`}
            >
              <p className="text-[10px] font-semibold text-ink">{day}</p>
              {list.slice(0, 2).map((ev) => (
                <p
                  key={ev.id}
                  className="mt-0.5 truncate text-[9px] text-[#0066D6]"
                  title={ev.title}
                >
                  {ev.title}
                </p>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-semibold text-smoke">다가오는 일정</p>
        {events
          .filter((e) => e.due_at && new Date(e.due_at).getTime() >= Date.now())
          .slice(0, 8)
          .map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl border border-mist bg-white/80 px-3 py-2"
            >
              <p className="text-[12px] font-semibold text-ink">{ev.title}</p>
              <p className="text-[10px] text-fog">
                {ev.kind} · {ev.due_at ? formatKstChatTime(ev.due_at) : ""}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export type VaultRow = {
  id: string;
  message_id: string;
  kind?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  mime_type?: string | null;
  created_at: string;
  vault_kind: string;
  content?: string | null;
  message_kind?: string | null;
  payload?: Record<string, unknown> | null;
  signed_url?: string;
};

const VAULT_TABS = [
  ["all", "전체"],
  ["media", "사진"],
  ["file", "파일"],
  ["exam", "기출"],
  ["link", "링크"],
  ["bookmark", "★"],
] as const;

export function ChatRoomVault({
  conversationId,
  onOpenMessage,
}: {
  conversationId: string;
  onOpenMessage?: (messageId: string) => void;
}) {
  const [tab, setTab] = useState<(typeof VAULT_TABS)[number][0]>("all");
  const [rows, setRows] = useState<VaultRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_dm_room_vault", {
        p_conversation_id: conversationId,
        p_tab: tab,
        p_limit: 80,
      });
      const list = (!error && data ? data : []) as VaultRow[];
      const paths = list
        .map((r) => r.file_path)
        .filter((p): p is string => Boolean(p));
      if (paths.length) {
        const { data: signed } = await supabase.storage
          .from("chat-media")
          .createSignedUrls(paths, 3600);
        const urls = Object.fromEntries(
          (signed ?? []).map((s) => [s.path, s.signedUrl]),
        );
        for (const row of list) {
          if (row.file_path) row.signed_url = urls[row.file_path];
        }
      }
      if (alive) {
        setRows(list);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [conversationId, tab]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-mist/70 px-3 py-2">
        {VAULT_TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
              tab === key
                ? "bg-[#007AFF] text-white"
                : "bg-white text-fog ring-1 ring-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <p className="py-10 text-center text-[13px] text-fog">불러오는 중…</p>
        ) : !rows.length ? (
          <p className="py-10 text-center text-[13px] text-fog">
            서랍에 아직 항목이 없어요.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => {
              if (row.vault_kind === "attachment" && row.kind === "image" && row.signed_url) {
                return (
                  <a
                    key={`${row.vault_kind}-${row.id}`}
                    href={row.signed_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-mist bg-white/80 p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.signed_url}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold">{row.file_name}</p>
                      <p className="text-[10px] text-fog">
                        {formatKstChatTime(row.created_at)}
                      </p>
                    </div>
                  </a>
                );
              }
              return (
                <button
                  key={`${row.vault_kind}-${row.id}`}
                  type="button"
                  onClick={() => onOpenMessage?.(row.message_id)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-mist bg-white/80 p-3 text-left"
                >
                  <span className="text-lg">
                    {row.vault_kind === "exam"
                      ? "📘"
                      : row.vault_kind === "link"
                        ? "🔗"
                        : row.vault_kind === "bookmark"
                          ? "★"
                          : row.kind === "file"
                            ? "📄"
                            : "📎"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-ink">
                      {row.file_name ||
                        row.content ||
                        row.message_kind ||
                        "항목"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-fog">
                      {row.vault_kind} · {formatKstChatTime(row.created_at)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
