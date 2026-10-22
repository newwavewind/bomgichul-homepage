import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CommunityScope } from "@/types/database";

/**
 * Check the public, unfiltered listing. A failed lookup is unknown, not empty,
 * so a temporary database failure must not remove an existing page from search.
 */
export const hasPublicListingContent = cache(async function hasPublicListingContent(
  scope: CommunityScope,
  kind: "community" | "archive",
): Promise<boolean | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("posts")
      .select("id")
      .eq("community_scope", scope)
      .limit(1);

    // Match the filters used by getPosts and getArchivePosts.
    if (kind === "archive") query = query.eq("category", "resource");

    const { data, error } = await query;
    if (error || data === null) return null;
    return data.length > 0;
  } catch {
    return null;
  }
});
