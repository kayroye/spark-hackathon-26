'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, CalendarPlus, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateICS, downloadICS } from '@/lib/ics';
import { useState } from 'react';
import { useReferrals } from '@/lib/db/hooks';
import { FACILITIES, Status } from '@/lib/db/schema';
import { QRWallet } from './QRWallet';
import { toast } from 'sonner';

interface PatientDetailProps {
  referralId: string;
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-scheduled-muted text-scheduled-foreground',
  high: 'bg-pending-muted text-pending-foreground',
  critical: 'bg-missed-muted text-missed-foreground',
};

const statusColors: Record<string, string> = {
  pending: 'bg-pending-muted text-pending-foreground',
  scheduled: 'bg-scheduled-muted text-scheduled-foreground',
  completed: 'bg-completed-muted text-completed-foreground',
  missed: 'bg-missed-muted text-missed-foreground',
};

export function PatientDetail({ referralId }: PatientDetailProps) {
  const router = useRouter();
  const { referrals, updateStatus, updateReferral } = useReferrals();
  const referral = referrals.find((r) => r.id === referralId);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [appointmentInput, setAppointmentInput] = useState('');

  if (!referral) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Referral not found or still loading...</p>
        <Button variant="link" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const facility = FACILITIES.find((f) => f.id === referral.facilityId);
  const createdDate = new Date(referral.createdAt).toLocaleDateString();
  const daysSinceCreated = referral.daysSinceCreated;
  const isOverdue = referral.isOverdue;

  const handleStatusChange = async (newStatus: Status) => {
    await updateStatus(referral.id, newStatus);
    toast.success(`Referral marked as ${newStatus}`);
  };

  const handleDownloadICS = async () => {
    const ics = await generateICS(referral);
    if (ics) {
      downloadICS(ics, `appointment-${referral.patientName.replace(/\s+/g, '-')}.ics`);
      toast.success('Calendar file downloaded');
    }
  };

  const handleSendReminder = async () => {
    if (!referral.patientPhone || !referral.appointmentDate) {
      toast.error('Phone number and appointment date are required');
      return;
    }

    const facility = FACILITIES.find((f) => f.id === referral.facilityId);

    setIsSendingSMS(true);
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: referral.patientPhone,
          patientName: referral.patientName,
          appointmentDate: referral.appointmentDate,
          facility: facility?.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error('Failed to send');

      if (data.demo) {
        toast.success('Demo mode: SMS reminder would be sent');
      } else {
        toast.success(`SMS sent to ${referral.patientPhone}`);
      }
    } catch {
      toast.error('Failed to send reminder');
    } finally {
      setIsSendingSMS(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push('/dashboard')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{referral.patientName}</CardTitle>
              <p className="text-muted-foreground">{referral.referralType}</p>
            </div>
            <div className="flex items-center gap-2">
              {referral.isSynced ? (
                <Badge variant="outline" className="bg-completed-muted">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Synced
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-pending-muted">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending Sync
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge className={priorityColors[referral.priority]}>
              {referral.priority} priority
            </Badge>
            <Badge className={statusColors[referral.status]}>
              {referral.status}
            </Badge>
            {isOverdue && <Badge className="bg-destructive text-destructive-foreground font-semibold">OVERDUE - {daysSinceCreated} days</Badge>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">Facility</h4>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{facility?.name}</span>
                <Badge variant="secondary">{facility?.distance}</Badge>
              </div>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">Created</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{createdDate}</span>
              </div>
            </div>

            {referral.patientPhone && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Phone</h4>
                <span>{referral.patientPhone}</span>
              </div>
            )}

            {referral.appointmentDate && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Appointment</h4>
                <span>{new Date(referral.appointmentDate).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium text-muted-foreground">Diagnosis</h4>
            <p>{referral.diagnosis}</p>
          </div>

          {referral.notes && (
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">Notes</h4>
              <p>{referral.notes}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">Update Status</h4>
            <Select value={referral.status} onValueChange={(v) => handleStatusChange(v as Status)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">Actions</h4>
            <div className="flex flex-wrap gap-2">
              <QRWallet referral={referral} />

              {referral.status === 'scheduled' && !referral.appointmentDate && (
                <div className="w-full mt-4 space-y-3">
                  <Label htmlFor="appointmentDate">Set Appointment Date & Time</Label>
                  <div className="flex gap-2">
                    <Input
                      id="appointmentDate"
                      type="datetime-local"
                      className="flex-1"
                      value={appointmentInput}
                      onChange={(e) => setAppointmentInput(e.target.value)}
                    />
                    <Button
                      onClick={async () => {
                        if (appointmentInput) {
                          await updateReferral(referral.id, {
                            appointmentDate: new Date(appointmentInput).toISOString()
                          });
                          toast.success('Appointment confirmed');
                          setAppointmentInput('');
                        } else {
                          toast.error('Please select a date and time');
                        }
                      }}
                      disabled={!appointmentInput}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {referral.appointmentDate && (
                <Button variant="outline" onClick={handleDownloadICS}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              )}

              {referral.patientPhone && referral.appointmentDate && (
                <Button
                  variant="outline"
                  onClick={handleSendReminder}
                  disabled={isSendingSMS}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {isSendingSMS ? 'Sending...' : 'Send SMS Reminder'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
