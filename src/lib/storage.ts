import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_MP4_FILE_SIZE_MB,
} from "@/lib/constants";

const BUCKET = "archive";

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "docx",
  "xlsx",
  "pptx",
  "zip",
  "txt",
  "csv",
  "hwp",
  "mp4",
]);

function getFileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function isMp4File(file: File): boolean {
  return getFileExtension(file) === "mp4" || file.type === "video/mp4";
}

function getMaxFileSizeMb(file: File): number {
  return isMp4File(file) ? MAX_MP4_FILE_SIZE_MB : MAX_FILE_SIZE_MB;
}

function isAllowedFile(file: File): boolean {
  const ext = getFileExtension(file);
  if (ALLOWED_EXTENSIONS.has(ext)) return true;
  if (file.type && ALLOWED_FILE_TYPES.includes(file.type)) return true;
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.includes("csv")) return "📑";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("word") || mimeType.includes("hwp")) return "📝";
  if (mimeType.includes("zip")) return "📦";
  return "📎";
}

export async function uploadArchiveFiles(
  userId: string,
  postId: string,
  files: File[]
): Promise<{ path: string; name: string; size: number; mime: string }[]> {
  const supabase = createClient();
  const uploaded: { path: string; name: string; size: number; mime: string }[] = [];

  for (const file of files) {
    if (!isAllowedFile(file)) {
      throw new Error(
        `"${file.name}"은(는) 지원하지 않는 형식입니다. PDF, 이미지, 문서, CSV, MP4, ZIP만 올릴 수 있습니다.`
      );
    }
    const maxMb = getMaxFileSizeMb(file);
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`"${file.name}"은(는) ${maxMb}MB를 초과합니다.`);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-가-힣]/g, "_");
    const path = `${userId}/${postId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(`"${file.name}" 업로드 실패: ${error.message}`);
    }

    uploaded.push({
      path,
      name: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
    });
  }

  return uploaded;
}

export function getPublicFileUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteArchiveFile(filePath: string) {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([filePath]);
}
