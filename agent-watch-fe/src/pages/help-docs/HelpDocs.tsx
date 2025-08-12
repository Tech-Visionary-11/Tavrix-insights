import { useParams } from 'react-router-dom';

import AppLayout from '../../libs/components/layout/app-layout/AppLayout';
import OverviewSection from './workflow/OverviewSection';
import ConnectFlowchartSection from './workflow/ConnectFlowchartSection';
import APIReferenceSection from './workflow/APIReferenceSection';
import TroubleshootingSection from './workflow/TroubleshootingSection';
import FAQSection from './workflow/FAQSection';

const HelpDocs = () => {
  // Get the agentId from the URL if it exists
  const { agentId } = useParams();

  return (
     <AppLayout>
          <div className="space-y-6"></div>
      {/* Conditionally show the OverviewSection only when there is no agentId */}
      {!agentId && <OverviewSection />}
      <ConnectFlowchartSection agentId={agentId} />
      <APIReferenceSection agentId={agentId} sessionId="<SESSION_ID>" />
      <TroubleshootingSection />
      <FAQSection />
    </AppLayout>
  );
};

export default HelpDocs;
