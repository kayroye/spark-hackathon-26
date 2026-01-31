import { ScanForm } from '@/components/scan/ScanForm';

export default function NurseScanPage() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="heading-3 text-slate-800">New Referral</h2>
        <p className="text-slate-500">
          Scan a referral form or enter details manually
        </p>
      </div>
      <ScanForm />
    </div>
  );
}
