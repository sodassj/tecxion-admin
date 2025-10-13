import DashboardClient from '../../DashboardClient';
import ConfigView from '../../views/ConfigView';

export default function ConfigPage() {
  return (
    <DashboardClient>
      <ConfigView />
    </DashboardClient>
  );
}