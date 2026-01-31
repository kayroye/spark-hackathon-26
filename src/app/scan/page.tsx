import { ScanForm } from '@/components/scan/ScanForm';

export default function ScanPage() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">New Referral</h2>
        <p className="text-gray-500">
          Scan a referral form or enter details manually
        </p>
      </div>
      <ScanForm />
    </div>
  );
}
