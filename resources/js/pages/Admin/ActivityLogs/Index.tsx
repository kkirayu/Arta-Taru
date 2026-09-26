import { Head, router } from '@inertiajs/react';
import { ScrollText } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import type { ActivityLogIndexProps } from '@/types';

export default function ActivityLogsIndex({ logs }: ActivityLogIndexProps) {
  const handlePageChange = (page: number) => {
    router.get('/admin/activity-logs', { page: String(page) }, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Activity Logs" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>

        <div className="bg-white rounded-xl border border-gray-200">
          {logs.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Waktu</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Aksi</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Subjek</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3 text-gray-900">{log.user?.name || '-'}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {log.subject_type
                          ? `${log.subject_type.split('\\').pop()} #${log.subject_id}`
                          : '-'}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell">{log.ip_address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={ScrollText} title="Tidak ada log" description="Belum ada aktivitas yang tercatat." />
          )}

          {logs.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={logs.current_page} lastPage={logs.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
