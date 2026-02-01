import { ChatView } from '@/features/citizen-report-agent/components/ChatView';
import { ChatNavbar } from '@/features/citizen-report-agent/components/ChatNavbar';

interface LaporThreadPageProps {
  params: Promise<{
    threadId: string;
  }>;
}

/**
 * Lapor Thread Page - Continue Existing Conversation
 *
 * Continue an existing conversation with the Citizen Report Agent.
 */
export default async function LaporThreadPage({ params }: LaporThreadPageProps) {
  const { threadId } = await params;
  return (
    <div className="flex h-screen flex-col">
      <ChatNavbar />
      <div className="flex-1 overflow-hidden">
        <ChatView threadId={threadId} showHeader={false} />
      </div>
    </div>
  );
}
