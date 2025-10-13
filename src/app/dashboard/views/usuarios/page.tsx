import DashboardClient from '../../DashboardClient';
import UsuariosView from '../../views/UsuariosView';

export default function UsuariosPage() {
  return (
    <DashboardClient>
      <UsuariosView />
    </DashboardClient>
  );
}