'use client';

import { CallbackForm } from '@/components/patient/CallbackForm';
import { Phone } from 'lucide-react';

export default function RequestCallbackPage() {
  const handleSubmit = async (data: {
    reason: string;
    preferredTime: string;
    notes: string;
  }) => {
    // In a real app, this would submit to an API
    console.log('Callback request submitted:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Request a Callback</h1>
        <p className="text-lg text-slate-600">
          Need to speak with someone? Let us know and we will call you back.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-6 bg-teal-50 rounded-xl border border-teal-200 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
          <Phone className="h-6 w-6 text-teal-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-teal-800">How it works</h2>
          <ol className="text-lg text-teal-700 space-y-1 list-decimal list-inside">
            <li>Fill out the form below with your question or concern</li>
            <li>Choose your preferred callback time</li>
            <li>We will call you back within 24 hours</li>
          </ol>
        </div>
      </div>

      {/* Callback Form */}
      <CallbackForm onSubmit={handleSubmit} />

      {/* Emergency Notice */}
      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Medical Emergency?</h3>
        <p className="text-lg text-red-700">
          If you are experiencing a medical emergency, please call{' '}
          <a href="tel:911" className="font-bold underline">
            911
          </a>{' '}
          or go to your nearest emergency room immediately.
        </p>
      </div>
    </div>
  );
}
