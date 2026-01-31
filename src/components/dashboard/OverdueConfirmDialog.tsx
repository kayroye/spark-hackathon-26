'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReferralWithMeta } from '@/lib/db/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface OverdueConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: ReferralWithMeta;
  newStatus: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export function OverdueConfirmDialog({
  open,
  onOpenChange,
  referral,
  newStatus,
  onConfirm,
  onCancel,
}: OverdueConfirmDialogProps) {
  const [note, setNote] = useState('');

  const daysOverdue = Math.max(0, referral.daysSinceCreated - 14);

  const isNoteValid = note.trim().length >= 10;

  const handleConfirm = () => {
    if (isNoteValid) {
      onConfirm(note.trim());
      setNote('');
    }
  };

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNote('');
      onCancel();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Moving Overdue Referral
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            This referral requires a note explaining the status change because it is overdue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium">{referral.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diagnosis</span>
                <span className="font-medium">{referral.diagnosis}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Overdue</span>
                <span className="font-semibold text-red-600">
                  {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Moving to</span>
                <span className="font-medium capitalize">{newStatus}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status-change-note" className="text-sm font-medium">
              Status Change Note <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="status-change-note"
              placeholder="Please explain why this overdue referral is being moved (min. 10 characters)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {note.trim().length}/10 characters minimum
              {!isNoteValid && note.trim().length > 0 && (
                <span className="text-red-500 ml-2">
                  ({10 - note.trim().length} more needed)
                </span>
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isNoteValid}>
            Confirm Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
