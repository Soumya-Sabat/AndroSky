import AdminSidebar from '@/component/adminboard/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}