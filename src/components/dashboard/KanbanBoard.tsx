'use client';

import { useReferrals } from '@/lib/db/hooks';
import { KanbanColumn } from './KanbanColumn';
import { Status } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Database, Trash2 } from 'lucide-react';
import { useSeed } from '@/lib/db/use-seed';
import { toast } from 'sonner';

const columns: { title: string; status: Status }[] = [
  { title: 'Pending', status: 'pending' },
  { title: 'Scheduled', status: 'scheduled' },
  { title: 'Completed', status: 'completed' },
  { title: 'Missed', status: 'missed' },
];

export function KanbanBoard() {
  const { referrals, loading } = useReferrals();
  const { seed, clear, isSeeding } = useSeed();

  const handleSeed = async () => {
    const seeded = await seed();
    if (seeded) {
      toast.success('Sample data loaded');
    } else {
      toast.info('Database already has data');
    }
  };

  const handleClear = async () => {
    await clear();
    toast.success('Database cleared');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading referrals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {referrals.length === 0 && (
        <div className="flex justify-center gap-2 py-4">
          <Button onClick={handleSeed} disabled={isSeeding} variant="outline">
            <Database className="mr-2 h-4 w-4" />
            {isSeeding ? 'Loading...' : 'Load Sample Data'}
          </Button>
        </div>
      )}

      {referrals.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button onClick={handleClear} disabled={isSeeding} variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Data
          </Button>
          <Button onClick={handleSeed} disabled={isSeeding} variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            Reset Demo Data
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            referrals={referrals.filter((r) => r.status === column.status)}
          />
        ))}
      </div>
    </div>
  );
}
