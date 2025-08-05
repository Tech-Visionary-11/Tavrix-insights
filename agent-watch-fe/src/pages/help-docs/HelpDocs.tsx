import { useParams } from 'react-router-dom';

import AppLayout from '../../libs/components/layout/app-layout/AppLayout';
import OverviewSection from './workflow/OverviewSection';
import ConnectFlowchartSection from './workflow/ConnectFlowchartSection';

const HelpDocs = () => {
  // Get the agentId from the URL if it exists
  const { agentId } = useParams();

  return (
     <AppLayout>
          <div className="space-y-6"></div>
      {/* Conditionally show the OverviewSection only when there is no agentId */}
      {!agentId && <OverviewSection />}
      <ConnectFlowchartSection agentId={agentId || ''} />
    </AppLayout>
  );
};

export default HelpDocs;
