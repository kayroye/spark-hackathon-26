'use client';

import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadICS, generateICS } from '@/lib/ics';
import type { Referral } from '@/lib/db/schema';

interface AddToCalendarButtonProps {
  referral: Referral;
  className?: string;
}

export function AddToCalendarButton({ referral, className }: AddToCalendarButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!referral.appointmentDate) return;

    setIsGenerating(true);
    try {
      const icsContent = await generateICS(referral);
      if (!icsContent) return;
      const safeType = referral.referralType.replace(/\s+/g, '-').toLowerCase();
      const filename = `appointment-${safeType}.ics`;
      downloadICS(icsContent, filename);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={!referral.appointmentDate || isGenerating}
      className={className}
    >
      <CalendarPlus className="h-4 w-4" />
      {isGenerating ? 'Preparing...' : 'Add to Calendar'}
    </Button>
  );
}
