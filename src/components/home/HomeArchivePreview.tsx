import Link from "next/link";
import { getArchivePosts } from "@/lib/archive";
import { ARCHIVE_RESOURCE_TYPE_MAP, ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import { getFileIcon } from "@/lib/storage";

export async function HomeArchivePreview() {
  const { data: posts } = await getArchivePosts({ page: 1, sort: "popular" });
  const preview = posts.slice(0, 4);

  if (preview.length === 0) return null;

  return (
    <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
      {preview.map((post) => {
        const firstFile = post.post_attachments?.[0];
        return (
          <Link
            key={post.id}
            href={`/archive/${post.id}`}
            className="flex items-center gap-3 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-4 py-3.5 shadow-[var(--shadow-card)] transition-colors hover:bg-snow"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-icons)] bg-surface text-lg">
              {firstFile ? getFileIcon(firstFile.mime_type) : "📁"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-body-sm font-medium text-ink">
                {post.title}
              </p>
              <p className="mt-0.5 truncate font-display text-[12px] text-fog">
                {post.resource_type ? ARCHIVE_RESOURCE_TYPE_MAP[post.resource_type] : ""}
                {post.subject ? ` · ${ARCHIVE_SUBJECT_MAP[post.subject] ?? post.subject}` : ""}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
