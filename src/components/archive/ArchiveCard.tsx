import Link from "next/link";
import type { Post } from "@/types/database";
import {
  ARCHIVE_RESOURCE_TYPE_MAP,
  ARCHIVE_SUBJECT_MAP,
} from "@/lib/constants";
import { formatFileSize, getFileIcon } from "@/lib/storage";

interface ArchiveCardProps {
  post: Post;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "오늘";
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export function ArchiveCard({ post }: ArchiveCardProps) {
  const attachments = post.post_attachments ?? [];
  const firstFile = attachments[0];

  return (
    <Link
      href={`/archive/${post.id}`}
      className="flex items-start gap-4 border-b border-mist/60 px-6 py-5 transition-colors last:border-b-0 hover:bg-snow"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-cards)] bg-surface text-2xl">
        {firstFile ? getFileIcon(firstFile.mime_type) : "📁"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {post.resource_type && (
            <span className="rounded-[var(--radius-tags)] bg-ice/50 px-2.5 py-0.5 font-display text-[12px] font-medium text-electric-blue">
              {ARCHIVE_RESOURCE_TYPE_MAP[post.resource_type] ?? post.resource_type}
            </span>
          )}
          {post.subject && (
            <span className="rounded-[var(--radius-tags)] bg-surface px-2.5 py-0.5 font-display text-[12px] text-smoke">
              {ARCHIVE_SUBJECT_MAP[post.subject] ?? post.subject}
            </span>
          )}
          {attachments.length > 0 && (
            <span className="font-display text-[12px] text-fog">
              📎 {attachments.length}개 파일
            </span>
          )}
        </div>
        <h3 className="truncate font-display text-body font-medium text-ink">
          {post.title}
        </h3>
        {firstFile && (
          <p className="mt-0.5 truncate font-display text-body-sm text-fog">
            {firstFile.file_name} · {formatFileSize(firstFile.file_size)}
          </p>
        )}
      </div>

      <div className="hidden shrink-0 text-right font-display text-body-sm text-fog sm:block">
        <p>{post.profiles?.nickname ?? "익명"}</p>
        <p className="mt-0.5">조회 {post.view_count}</p>
        <p className="mt-0.5">{formatDate(post.created_at)}</p>
      </div>
    </Link>
  );
}
