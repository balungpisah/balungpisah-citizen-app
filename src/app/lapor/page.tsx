import { ChatView } from '@/features/citizen-report-agent/components/ChatView';
import { LaporWrapper } from '@/features/citizen-report-agent/components/LaporWrapper';

/**
 * Lapor Page - New Conversation
 *
 * Start a new conversation with the Citizen Report Agent.
 */
export default function LaporPage() {
  return (
    <LaporWrapper>
      <ChatView showHeader={false} />
    </LaporWrapper>
  );
}
