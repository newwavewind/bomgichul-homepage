import type { PostAttachment } from "@/types/database";
import { formatFileSize, getFileIcon, getPublicFileUrl } from "@/lib/storage";

interface AttachmentListProps {
  attachments: PostAttachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-6 rounded-[var(--radius-cards)] border border-mist/60 bg-surface p-5">
      <h3 className="mb-4 font-display text-body font-semibold text-ink">
        첨부 파일 ({attachments.length})
      </h3>
      <ul className="space-y-2">
        {attachments.map((file) => (
          <li key={file.id}>
            <a
              href={getPublicFileUrl(file.file_path)}
              target="_blank"
              rel="noopener noreferrer"
              download={file.file_name}
              className="flex items-center gap-3 rounded-[var(--radius-cards)] bg-paper px-4 py-3 transition-colors hover:bg-snow"
            >
              <span className="text-2xl">{getFileIcon(file.mime_type)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-body-sm font-medium text-ink">
                  {file.file_name}
                </p>
                <p className="font-display text-[12px] text-fog">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
              <span className="shrink-0 font-display text-body-sm font-medium text-electric-blue">
                다운로드 ↓
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AttachmentListServerProps {
  attachments: PostAttachment[];
}

export function AttachmentListServer({ attachments }: AttachmentListServerProps) {
  if (attachments.length === 0) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="mt-6 rounded-[var(--radius-cards)] border border-mist/60 bg-surface p-5">
      <h3 className="mb-4 font-display text-body font-semibold text-ink">
        첨부 파일 ({attachments.length})
      </h3>
      <ul className="space-y-2">
        {attachments.map((file) => {
          const url = supabaseUrl
            ? `${supabaseUrl}/storage/v1/object/public/archive/${file.file_path}`
            : "#";
          return (
            <li key={file.id}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download={file.file_name}
                className="flex items-center gap-3 rounded-[var(--radius-cards)] bg-paper px-4 py-3 transition-colors hover:bg-snow"
              >
                <span className="text-2xl">{getFileIcon(file.mime_type)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-body-sm font-medium text-ink">
                    {file.file_name}
                  </p>
                  <p className="font-display text-[12px] text-fog">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
                <span className="shrink-0 font-display text-body-sm font-medium text-electric-blue">
                  다운로드 ↓
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
