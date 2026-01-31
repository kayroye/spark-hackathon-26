'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CallbackReason = 'general' | 'appointment' | 'health' | 'other';
type PreferredTime = 'morning' | 'afternoon' | 'evening';

interface CallbackFormData {
  reason: CallbackReason;
  preferredTime: PreferredTime;
  notes: string;
}

interface CallbackFormProps {
  onSubmit?: (data: CallbackFormData) => Promise<void>;
}

const CALLBACK_REASONS = [
  { value: 'general', label: 'General question' },
  { value: 'appointment', label: 'Appointment issue' },
  { value: 'health', label: 'Health concern' },
  { value: 'other', label: 'Other' },
] as const;

const PREFERRED_TIMES = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 8pm)' },
] as const;

export function CallbackForm({ onSubmit }: CallbackFormProps) {
  const [reason, setReason] = useState<CallbackReason | ''>('');
  const [preferredTime, setPreferredTime] = useState<PreferredTime | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValid = reason !== '' && preferredTime !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError('Please select a reason and preferred time');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit({
          reason: reason as CallbackReason,
          preferredTime: preferredTime as PreferredTime,
          notes,
        });
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setIsSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setReason('');
    setPreferredTime('');
    setNotes('');
    setIsSuccess(false);
    setError('');
  };

  if (isSuccess) {
    return (
      <Card className="bg-card shadow-md border-border">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-completed-muted flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-completed-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">Request Submitted</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We have received your callback request. A member of our team will call you back within 24 hours.
            </p>
          </div>

          <div className="p-4 bg-scheduled-muted rounded-lg border border-scheduled-muted">
            <p className="text-base text-scheduled-foreground">
              <strong>Preferred time:</strong>{' '}
              {PREFERRED_TIMES.find((t) => t.value === preferredTime)?.label}
            </p>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="h-14 px-8 text-lg border-accent text-accent hover:bg-accent/10"
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-md border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Reason for Callback */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-foreground">
              Reason for callback <span className="text-destructive">*</span>
            </label>
            <Select value={reason} onValueChange={(value) => setReason(value as CallbackReason)}>
              <SelectTrigger className="w-full h-14 text-lg border-input focus:border-accent">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {CALLBACK_REASONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-lg py-3 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-foreground">
              Preferred callback time <span className="text-destructive">*</span>
            </label>
            <Select
              value={preferredTime}
              onValueChange={(value) => setPreferredTime(value as PreferredTime)}
            >
              <SelectTrigger className="w-full h-14 text-lg border-input focus:border-accent">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {PREFERRED_TIMES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-lg py-3 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-foreground">
              Additional notes <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us more about why you need a callback..."
              className="min-h-[120px] text-lg border-input focus:border-accent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-missed-muted rounded-lg border border-missed-muted">
              <p className="text-base text-missed-foreground">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              'w-full h-14 text-lg font-semibold',
              'bg-accent hover:bg-accent/90 text-accent-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Request Callback'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
