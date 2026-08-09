"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { uploadArchiveFiles } from "@/lib/storage";
import {
  ARCHIVE_RESOURCE_TYPES,
  archiveSubjectsForScope,
  defaultArchiveSubject,
} from "@/lib/constants";
import { FeatureCard } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { FileUpload } from "@/components/archive/FileUpload";
import {
  archiveBaseHref,
  scopeFromPathname,
} from "@/lib/exam-track/community";
import type { ResourceType } from "@/types/database";

export default function ArchiveUploadPage() {
  const router = useRouter();
  const pathname = usePathname();
  const scope = scopeFromPathname(pathname);
  const baseHref = archiveBaseHref(scope);
  const subjectOptions = useMemo(
    () => archiveSubjectsForScope(scope).filter((s) => s.value !== "all"),
    [scope],
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("note");
  const [subject, setSubject] = useState(defaultArchiveSubject(scope));
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase 연결이 필요합니다. .env.local을 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data: post, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title,
          content,
          category: "resource",
          community_scope: scope,
          resource_type: resourceType,
          subject,
        })
        .select("id")
        .single();

      if (insertError || !post) {
        setError(insertError?.message ?? "등록에 실패했습니다.");
        setLoading(false);
        return;
      }

      if (files.length > 0) {
        try {
          const uploaded = await uploadArchiveFiles(user.id, post.id, files);
          const { error: attachError } = await supabase.from("post_attachments").insert(
            uploaded.map((f) => ({
              post_id: post.id,
              file_name: f.name,
              file_path: f.path,
              file_size: f.size,
              mime_type: f.mime,
            })),
          );

          if (attachError) {
            setError(`글은 등록됐지만 파일 첨부에 실패했습니다: ${attachError.message}`);
            setLoading(false);
            return;
          }
        } catch (uploadErr) {
          setError(uploadErr instanceof Error ? uploadErr.message : "파일 업로드 실패");
          setLoading(false);
          return;
        }
      }

      router.push(`${baseHref}/${post.id}`);
      router.refresh();
    } catch {
      setError("등록 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const typeOptions = ARCHIVE_RESOURCE_TYPES.filter((t) => t.value !== "all");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href={baseHref}>자료실로</BackLink>

      <EyebrowLabel className="mb-2">자료 등록</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8">
        자료 올리기
      </SectionHeading>

      <FeatureCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-3 block font-display text-body-sm font-medium text-ink">자료 유형</label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setResourceType(t.value as ResourceType)}
                  className={`rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium ${
                    resourceType === t.value ? "bg-midnight text-paper" : "bg-paper text-ink hover:bg-surface"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block font-display text-body-sm font-medium text-ink">과목</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-[var(--radius-input)] border border-mist bg-paper px-4 py-3 font-display text-body text-ink outline-none focus:border-electric-blue"
            >
              {subjectOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="title"
            label="자료 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="예: 기출 정리 PDF"
          />

          <Textarea
            id="content"
            label="설명"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            placeholder="자료에 대한 설명, 포함 내용, 사용 팁 등을 적어주세요"
          />

          <FileUpload files={files} onChange={setFiles} disabled={loading} />

          {error && <p className="font-display text-body-sm text-coral">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={baseHref}
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm text-fog"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "등록 중..." : "자료 등록"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}
