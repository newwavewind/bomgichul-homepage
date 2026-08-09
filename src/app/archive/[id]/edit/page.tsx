"use client";

import { useEffect, useMemo, useState } from "react";
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
  isValidCommunityScope,
  scopeFromPathname,
} from "@/lib/exam-track/community";
import type {
  CommunityScope,
  Post,
  PostAttachment,
  ResourceType,
} from "@/types/database";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function ArchiveEditPage({ params }: EditPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeScope = scopeFromPathname(pathname);
  const [postId, setPostId] = useState("");
  const [scope, setScope] = useState<CommunityScope>(routeScope);
  const baseHref = archiveBaseHref(scope);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("note");
  const [subject, setSubject] = useState(defaultArchiveSubject(routeScope));
  const [existingAttachments, setExistingAttachments] = useState<PostAttachment[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id);
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.push("/login");
          return;
        }

        supabase
          .from("posts")
          .select("*, post_attachments(*)")
          .eq("id", id)
          .eq("category", "resource")
          .single()
          .then(({ data, error: fetchError }) => {
            if (fetchError || !data) {
              router.push(archiveBaseHref(routeScope));
              return;
            }
            const post = data as Post;
            const postScope = isValidCommunityScope(post.community_scope)
              ? post.community_scope
              : "real_estate";
            const postBase = archiveBaseHref(postScope);
            if (post.author_id !== user.id) {
              router.push(`${postBase}/${id}`);
              return;
            }
            setScope(postScope);
            setTitle(post.title);
            setContent(post.content);
            setResourceType((post.resource_type as ResourceType) ?? "note");
            setSubject(post.subject ?? defaultArchiveSubject(postScope));
            setExistingAttachments(post.post_attachments ?? []);
            setLoading(false);
          });
      });
    });
  }, [params, router, routeScope]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase 연결이 필요합니다.");
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다.");
        setSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title,
          content,
          resource_type: resourceType,
          subject,
        })
        .eq("id", postId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      if (newFiles.length > 0) {
        try {
          const uploaded = await uploadArchiveFiles(user.id, postId, newFiles);
          const { error: attachError } = await supabase.from("post_attachments").insert(
            uploaded.map((f) => ({
              post_id: postId,
              file_name: f.name,
              file_path: f.path,
              file_size: f.size,
              mime_type: f.mime,
            }))
          );

          if (attachError) {
            setError(`글은 저장됐지만 파일 첨부에 실패했습니다: ${attachError.message}`);
            setSaving(false);
            return;
          }
        } catch (uploadErr) {
          setError(uploadErr instanceof Error ? uploadErr.message : "파일 업로드 실패");
          setSaving(false);
          return;
        }
      }

      router.push(`${baseHref}/${postId}`);
      router.refresh();
    } catch {
      setError("수정에 실패했습니다.");
    }

    setSaving(false);
  };

  const typeOptions = ARCHIVE_RESOURCE_TYPES.filter((t) => t.value !== "all");
  const subjectOptions = useMemo(
    () => archiveSubjectsForScope(scope).filter((s) => s.value !== "all"),
    [scope],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-display text-body text-smoke">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href={`${baseHref}/${postId}`}>돌아가기</BackLink>

      <EyebrowLabel className="mb-2">자료 수정</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8">
        자료 수정하기
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
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <Input
            id="title"
            label="자료 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="content"
            label="설명"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
          />

          {existingAttachments.length > 0 && (
            <div>
              <p className="mb-2 font-display text-body-sm font-medium text-ink">
                기존 첨부 ({existingAttachments.length})
              </p>
              <ul className="space-y-1 rounded-[var(--radius-cards)] border border-mist/60 bg-surface p-3">
                {existingAttachments.map((file) => (
                  <li key={file.id} className="font-display text-body-sm text-smoke">
                    {file.file_name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FileUpload
            files={newFiles}
            onChange={setNewFiles}
            disabled={saving}
            label="추가 파일 (선택)"
          />

          {error && <p className="font-display text-body-sm text-coral">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link
              href={`${baseHref}/${postId}`}
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm text-fog"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "저장 중..." : "저장하기"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}
