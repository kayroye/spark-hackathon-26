'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ExternalLink, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FACILITIES, FacilityId } from '@/lib/db/schema';

interface AppointmentCardProps {
  id: string;
  referralType: string;
  facilityId: FacilityId;
  appointmentDate: string;
  onConfirm?: (id: string) => Promise<void>;
  onRequestReschedule?: (id: string) => void;
  isConfirmed?: boolean;
}

export function AppointmentCard({
  id,
  referralType,
  facilityId,
  appointmentDate,
  onConfirm,
  onRequestReschedule,
  isConfirmed = false,
}: AppointmentCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(isConfirmed);

  const facility = FACILITIES.find((f) => f.id === facilityId);
  const date = new Date(appointmentDate);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsConfirming(true);
      try {
        await onConfirm(id);
        setConfirmed(true);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  const handleReschedule = () => {
    if (onRequestReschedule) {
      onRequestReschedule(id);
    }
  };

  // Generate Google Maps link
  const mapsLink = facility
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name)}`
    : '#';

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-slate-200">
      <CardContent className="p-6 space-y-6">
        {/* Date and Time - Prominently Displayed */}
        <div className="text-center p-6 bg-teal-50 rounded-xl border border-teal-200">
          <div className="flex items-center justify-center gap-2 text-teal-700 mb-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-semibold">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-teal-600">
            <Clock className="h-5 w-5" />
            <span className="text-2xl font-bold">{formattedTime}</span>
          </div>
        </div>

        {/* Referral Type */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900">{referralType}</h3>
        </div>

        {/* Facility Information */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-lg font-medium text-slate-900">{facility?.name || 'Unknown Facility'}</p>
              {facility?.distance && (
                <p className="text-base text-slate-600">{facility.distance} away</p>
              )}
            </div>
          </div>

          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-teal-600 hover:text-teal-700 font-medium py-2 px-4 rounded-lg bg-white border border-teal-200 hover:bg-teal-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span className="text-base">Open in Maps</span>
          </a>
        </div>

        {/* Confirmation Status or Actions */}
        {confirmed ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
            <span className="text-lg font-medium text-emerald-700">Attendance Confirmed</span>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={cn(
                'w-full h-14 text-lg font-semibold',
                'bg-teal-600 hover:bg-teal-700 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isConfirming ? 'Confirming...' : 'Confirm Attendance'}
            </Button>

            <button
              onClick={handleReschedule}
              className="w-full text-center text-lg text-teal-600 hover:text-teal-700 hover:underline font-medium py-2"
            >
              Request Reschedule
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
