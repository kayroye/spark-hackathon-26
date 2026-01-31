'use client';

import { KanbanBoard } from '@/components/dashboard/KanbanBoard';

export default function NurseDashboardPage() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="heading-3 text-foreground">Referral Dashboard</h2>
        <p className="text-muted-foreground">
          Track and manage patient referrals for Clearwater Ridge
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
