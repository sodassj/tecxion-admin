import DashboardClient from '../../DashboardClient';
import AnaliticasView from '../../views/AnaliticasView';

export default function AnaliticasPage() {
  return (
    <DashboardClient>
      <AnaliticasView />
    </DashboardClient>
  );
}