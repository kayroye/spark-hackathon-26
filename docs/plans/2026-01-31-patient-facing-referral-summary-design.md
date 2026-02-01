# Patient-Facing Referral Summary Design

## Overview

Add a patient-friendly summary field to referrals so patients see simple, non-clinical explanations instead of medical jargon. Also track which nurse created each referral so patients see their care coordinator's name and phone number.

## Problem

Currently patients see the same clinical information as nurses:
> "Atrial fibrillation with rapid ventricular response. Requires cardiology follow-up and anticoagulation management."

Patients should see friendly language:
> "Your heart rhythm was irregular during your last visit. We're referring you to a heart specialist to check everything is okay."

## Schema Changes

### Referral Schema

Add two new required fields:

```typescript
interface Referral {
  // ... existing fields ...
  patientSummary: string;      // Required - nurse-written, patient-facing
  createdByNurseId: string;    // Required - links to nurse who created it
}
```

### User Schema

Add optional phone field for nurses:

```typescript
interface User {
  // ... existing fields ...
  phone?: string;              // Displayed to patients as contact number
}
```

## Patient View Changes

### Show
- "About Your Referral" → `patientSummary` field
- "Your Care Coordinator" → nurse name + phone from linked user

### Hide
- `diagnosis` (clinical language - nurses only)
- `notes` (internal notes - nurses only)

### Example Display

```
Your Care Coordinator
Sarah Mitchell, RN
(867) 555-3847
```

## Seed Data

### Three Demo Nurses

| Name | Email | Phone |
|------|-------|-------|
| Sarah Mitchell, RN | nurse@carelink.demo | (867) 555-3847 |
| James Makwa, RN | james@carelink.demo | (867) 555-6192 |
| Linda Chen, RN | linda@carelink.demo | (867) 555-2784 |

### Referral Distribution

| Patient | Referral Type | Assigned Nurse |
|---------|--------------|----------------|
| Margaret Thompson | Cardiology (critical) | Sarah Mitchell, RN |
| James Whitehorse | Cardiology (scheduled) | James Makwa, RN |
| Sarah Running Bear | Mental Health | Linda Chen, RN |
| Robert Chen | Follow-up (completed) | Sarah Mitchell, RN |
| Emily Blackwood | Oncology (critical) | James Makwa, RN |
| William Frost | Neurology | Linda Chen, RN |
| Dorothy Clearsky | Cardiology (missed) | Sarah Mitchell, RN |

### Sample Patient Summaries

| Patient | Patient Summary |
|---------|-----------------|
| Margaret Thompson | "Your heart rhythm was irregular during your last visit. We're referring you to a heart specialist to check everything is okay and discuss treatment options." |
| James Whitehorse | "Your blood sugar levels need better management. You'll be seeing a specialist to adjust your treatment plan." |
| Sarah Running Bear | "We're connecting you with a counselor to help with the stress you've been experiencing. Virtual appointments are available." |
| Robert Chen | "This was a follow-up after your surgery. Everything healed well." |
| Emily Blackwood | "We found something during your exam that needs a closer look. You're scheduled for imaging to get more information." |
| William Frost | "Your back pain needs specialist attention. We're referring you to a nerve specialist to discuss treatment options." |
| Dorothy Clearsky | "Your heart check-up was rescheduled due to the storm. Please contact us to book a new appointment." |

## UI Changes

### Nurse Side (Creating Referrals)

- New required field "Patient Summary" in scan/referral form
- Placeholder: "Explain this referral in simple terms for the patient..."
- Textarea (multi-line) positioned after diagnosis field
- `createdByNurseId` auto-populated from logged-in nurse session

### Patient Side (Viewing Referrals)

- Remove "Diagnosis" section
- Remove "Notes" section
- Add "About Your Referral" section showing `patientSummary`
- Replace hardcoded nurse phone with care coordinator info

## Migration

- Bump RxDB schema versions (referrals: 0→1, users: 0→1)
- Existing auto-reset on schema mismatch handles migration
- Fresh seed data replaces old referrals

## Files to Modify

1. `src/lib/db/schema.ts` - Add new fields to interfaces and RxDB schemas
2. `src/lib/seed-data.ts` - Update nurses, add patientSummary to referrals
3. `src/components/scan/ScanForm.tsx` - Add patientSummary field
4. `src/components/scan/scanFormSchema.ts` - Add validation
5. `src/app/(patient)/my-referrals/[id]/page.tsx` - Update patient view
6. `src/components/patient/ReferralCard.tsx` - Update card display if needed
