'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Status, FACILITIES, FacilityId } from '@/lib/db/schema';

interface ReferralCardProps {
  referralType: string;
  facilityId: FacilityId;
  status: Status;
  appointmentDate?: string;
  onViewDetails?: () => void;
}

const STATUS_CONFIG: Record<Status, { label: string; step: number; color: string; bgColor: string }> = {
  pending: {
    label: 'Awaiting Scheduling',
    step: 1,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  scheduled: {
    label: 'Appointment Scheduled',
    step: 2,
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-900/40',
  },
  completed: {
    label: 'Completed',
    step: 4,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  missed: {
    label: 'Missed - Please Contact Us',
    step: 2,
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
};

function getStatusStep(status: Status): number {
  return STATUS_CONFIG[status].step;
}

function getNextAction(status: Status, appointmentDate?: string): string {
  switch (status) {
    case 'pending':
      return 'We are working on scheduling your appointment';
    case 'scheduled':
      return appointmentDate
        ? `Please attend your appointment on ${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
        : 'Your appointment date will be confirmed soon';
    case 'completed':
      return 'Your referral has been completed. Thank you!';
    case 'missed':
      return 'You missed your scheduled appointment. Please request a callback to reschedule.';
    default:
      return '';
  }
}

export function ReferralCard({
  referralType,
  facilityId,
  status,
  appointmentDate,
  onViewDetails,
}: ReferralCardProps) {
  const facility = FACILITIES.find((f) => f.id === facilityId);
  const currentStep = getStatusStep(status);
  const statusConfig = STATUS_CONFIG[status];
  const nextAction = getNextAction(status, appointmentDate);

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700">
      <CardContent className="p-6 space-y-6">
        {/* Header with Referral Type and Facility */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{referralType}</h3>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <span className="text-lg">{facility?.name || 'Unknown Facility'}</span>
          </div>
        </div>

        {/* Status Badge */}
        <Badge className={cn('text-base px-4 py-1.5', statusConfig.bgColor, statusConfig.color)}>
          {statusConfig.label}
        </Badge>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <p className="text-base font-medium text-slate-700 dark:text-slate-300">
            Step {currentStep} of 4: {statusConfig.label}
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  'h-3 flex-1 rounded-full transition-colors',
                  step <= currentStep ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-600'
                )}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Pending</span>
            <span>Scheduled</span>
            <span>Attended</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Appointment Date (if scheduled) */}
        {appointmentDate && status === 'scheduled' && (
          <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800">
            <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="text-base font-medium text-teal-800 dark:text-teal-300">Appointment Date</p>
              <p className="text-lg text-teal-900 dark:text-teal-100">
                {new Date(appointmentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}

        {/* Next Action */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <p className="text-base text-slate-700 dark:text-slate-300">{nextAction}</p>
        </div>

        {/* View Details Button */}
        {onViewDetails && (
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="w-full h-14 text-lg border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-600"
          >
            View Details
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
