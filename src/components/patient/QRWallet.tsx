'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode } from 'lucide-react';
import { Referral, FACILITIES } from '@/lib/db/schema';

interface QRWalletProps {
  referral: Referral;
}

interface WalletData {
  n: string;
  d: string;
  p: string;
  f: string;
  t: string;
  e: number;
}

export function QRWallet({ referral }: QRWalletProps) {
  const [isOpen, setIsOpen] = useState(false);

  const facility = FACILITIES.find((f) => f.id === referral.facilityId);

  const walletData: WalletData = {
    n: referral.patientName,
    d: referral.diagnosis.substring(0, 100),
    p: referral.priority,
    f: facility?.name || '',
    t: referral.referralType,
    e: Date.now() + 24 * 60 * 60 * 1000,
  };

  const encodedData = btoa(JSON.stringify(walletData));
  const walletUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/wallet/${encodedData}`
    : `/wallet/${encodedData}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Smart Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          <QRCodeSVG
            value={walletUrl}
            size={256}
            level="M"
            includeMargin
          />
          <div className="text-center">
            <p className="font-semibold">{referral.patientName}</p>
            <p className="text-sm text-muted-foreground">
              Scan to view patient health summary
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Expires in 24 hours
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
