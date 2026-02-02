import { ChatView } from '@/features/citizen-report-agent/components/ChatView';
import { ChatNavbar } from '@/features/citizen-report-agent/components/ChatNavbar';

/**
 * Lapor Page - New Conversation
 *
 * Start a new conversation with the Citizen Report Agent.
 */
export default function LaporPage() {
  return (
    <div className="flex h-dvh flex-col">
      <ChatNavbar />
      <div className="min-h-0 flex-1">
        <ChatView showHeader={false} />
      </div>
    </div>
  );
}
