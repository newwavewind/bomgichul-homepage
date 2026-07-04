"use client";

import { useRef, useState } from "react";
import { formatFileSize, getFileIcon } from "@/lib/storage";
import {
  MAX_FILES_PER_POST,
  MAX_FILE_SIZE_MB,
  MAX_MP4_FILE_SIZE_MB,
} from "@/lib/constants";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
}

export function FileUpload({ files, onChange, disabled, label = "첨부 파일" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES_PER_POST) break;
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    onChange(next.slice(0, MAX_FILES_PER_POST));
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="mb-2 block font-display text-body-sm font-medium text-ink">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        className={`
          cursor-pointer rounded-[var(--radius-cards)] border-2 border-dashed px-6 py-10 text-center transition-colors
          ${dragOver ? "border-electric-blue bg-ice/30" : "border-mist hover:border-electric-blue/50 hover:bg-surface"}
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <p className="font-display text-body font-medium text-ink">
          파일을 드래그하거나 클릭하여 선택
        </p>
        <p className="mt-1 font-display text-body-sm text-fog">
          PDF, 이미지, HWP, DOCX, XLSX, CSV, ZIP · 최대 {MAX_FILE_SIZE_MB}MB · MP4 {MAX_MP4_FILE_SIZE_MB}MB · {MAX_FILES_PER_POST}개
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          disabled={disabled}
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.pptx,.zip,.txt,.csv,.hwp,.mp4,video/mp4,text/csv"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-cards)] bg-surface px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-xl">{getFileIcon(file.type)}</span>
                <div className="min-w-0">
                  <p className="truncate font-display text-body-sm font-medium text-ink">
                    {file.name}
                  </p>
                  <p className="font-display text-[12px] text-fog">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                disabled={disabled}
                className="shrink-0 font-display text-body-sm text-coral hover:underline"
              >
                제거
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
