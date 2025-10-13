import DashboardClient from '../../DashboardClient';
import HorariosView from '../../views/HorariosView';

export default function HorariosPage() {
  return (
    <DashboardClient>
      <HorariosView />
    </DashboardClient>
  );
}