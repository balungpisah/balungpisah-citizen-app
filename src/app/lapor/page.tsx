import { ChatView } from '@/features/citizen-report-agent/components/ChatView';
import { ChatNavbar } from '@/features/citizen-report-agent/components/ChatNavbar';

/**
 * Lapor Page - New Conversation
 *
 * Start a new conversation with the Citizen Report Agent.
 */
export default function LaporPage() {
  return (
    <div className="flex h-screen flex-col">
      <ChatNavbar />
      <div className="flex-1 overflow-hidden">
        <ChatView showHeader={false} />
      </div>
    </div>
  );
}
