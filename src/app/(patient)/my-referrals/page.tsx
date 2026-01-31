'use client';

import { useReferrals } from '@/lib/db/hooks';
import { ReferralCard } from '@/components/patient/ReferralCard';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';

export default function MyReferralsPage() {
  const { referrals, loading } = useReferrals();

  // In a real app, we would filter referrals by the logged-in patient
  // For now, we show all referrals as demo data
  const patientReferrals = referrals;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-lg text-slate-600 dark:text-slate-400">Loading your referrals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Health Referrals</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          View and track the status of your healthcare referrals
        </p>
      </div>

      {/* Referrals List or Empty State */}
      {patientReferrals.length === 0 ? (
        <Card className="bg-white dark:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">No Referrals Yet</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                You do not have any active referrals at this time. When your healthcare provider
                creates a referral for you, it will appear here.
              </p>
            </div>

            <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800 max-w-md mx-auto">
              <p className="text-base text-teal-700 dark:text-teal-300">
                If you believe you should have a referral, please contact your healthcare provider
                or request a callback.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              You have <span className="font-semibold text-teal-700 dark:text-teal-400">{patientReferrals.length}</span>{' '}
              active referral{patientReferrals.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Referral Cards */}
          <div className="space-y-6">
            {patientReferrals.map((referral) => (
              <ReferralCard
                key={referral.id}
                referralType={referral.referralType}
                facilityId={referral.facilityId}
                status={referral.status}
                appointmentDate={referral.appointmentDate}
                onViewDetails={() => {
                  // TODO: Navigate to referral details page
                  console.log('View details for', referral.id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
