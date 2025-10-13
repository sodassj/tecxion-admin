import DashboardClient from '../../DashboardClient';
import RutasView from '../../views/RutasView';

export default function RutasPage() {
  return (
    <DashboardClient>
      <RutasView />
    </DashboardClient>
  );
}