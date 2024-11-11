
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>    
    {children}
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="lead">Página não encontrada.</p>
        <p className="fs-4">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a href="/dashboard" className="btn btn-primary mt-4">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  </DashboardLayout>;
}