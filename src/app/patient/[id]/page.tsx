'use client';

import { use } from 'react';
import { PatientDetail } from '@/components/patient/PatientDetail';

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-4">
      <PatientDetail referralId={id} />
    </div>
  );
}
