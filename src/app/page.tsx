import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import { CompanyDataTable } from '@/components/CompanyDataTable';

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">StartupHub</h1>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center p-24">
        <div className="w-full max-w-7xl">
          <CompanyDataTable />
        </div>
      </main>
    </div>
  );
}
