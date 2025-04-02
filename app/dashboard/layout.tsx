

import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout >{children}</DashboardLayout>;
}


// import { Header } from '@/components/layout/header';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1 bg-gray-50">
//         {children}
//       </main>
//     </div>
//   );
// }