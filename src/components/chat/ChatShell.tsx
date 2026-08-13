import { getUser } from "@/lib/auth";
import { getDmConversations } from "@/lib/dm";
import { ChatWidget } from "@/components/chat/ChatWidget";

export async function ChatShell() {
  const user = await getUser();
  if (!user?.usernameSet) return null;

  const conversations = await getDmConversations(user.id);

  return (
    <ChatWidget
      user={{ id: user.id, nickname: user.nickname, avatar_url: user.avatar_url }}
      initialConversations={conversations}
    />
  );
}
