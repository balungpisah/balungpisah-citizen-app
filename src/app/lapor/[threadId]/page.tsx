import { ChatView } from '@/features/citizen-report-agent/components/ChatView';

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
    <div className="h-screen">
      <ChatView threadId={threadId} />
    </div>
  );
}
