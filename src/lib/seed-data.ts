import { getDatabase } from './db';
import { v4 as uuidv4 } from 'uuid';

const sampleReferrals = [
  {
    patientName: 'Margaret Thompson',
    patientPhone: '+1-555-0101',
    diagnosis: 'Atrial fibrillation with rapid ventricular response. Requires cardiology follow-up and anticoagulation management.',
    priority: 'critical' as const,
    status: 'pending' as const,
    facilityId: 'regional-hospital' as const,
    referralType: 'Cardiology',
    notes: 'Patient experienced palpitations during community dinner. ECG showed AFib. Started on rate control.',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), // 16 days ago - OVERDUE
  },
  {
    patientName: 'James Whitehorse',
    patientPhone: '+1-555-0102',
    diagnosis: 'Type 2 diabetes with poor glycemic control. HbA1c 9.2%. Needs endocrinology consultation for insulin adjustment.',
    priority: 'high' as const,
    status: 'scheduled' as const,
    facilityId: 'specialist-clinic' as const,
    referralType: 'Cardiology',
    appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    patientName: 'Sarah Running Bear',
    diagnosis: 'Generalized anxiety disorder with recent increase in symptoms following community layoffs. Requesting counseling services.',
    priority: 'medium' as const,
    status: 'pending' as const,
    facilityId: 'mental-health-center' as const,
    referralType: 'Mental Health',
    notes: 'Patient prefers virtual appointments due to stigma concerns. Has reliable internet access.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    patientName: 'Robert Chen',
    patientPhone: '+1-555-0104',
    diagnosis: 'Post-surgical follow-up for appendectomy performed during last medical evacuation. Healing well, no complications.',
    priority: 'low' as const,
    status: 'completed' as const,
    facilityId: 'community-health' as const,
    referralType: 'Follow-up',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    patientName: 'Emily Blackwood',
    patientPhone: '+1-555-0105',
    diagnosis: 'Suspected breast mass on self-exam. Urgent imaging and oncology referral needed for evaluation.',
    priority: 'critical' as const,
    status: 'scheduled' as const,
    facilityId: 'specialist-clinic' as const,
    referralType: 'Oncology',
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    patientName: 'William Frost',
    patientPhone: '+1-555-0106',
    diagnosis: 'Chronic lower back pain with radiculopathy. MRI shows L4-L5 disc herniation. Requires neurology consultation.',
    priority: 'medium' as const,
    status: 'pending' as const,
    facilityId: 'specialist-clinic' as const,
    referralType: 'Neurology',
    notes: 'Patient is a forestry worker. Pain affecting ability to work.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    patientName: 'Dorothy Clearsky',
    diagnosis: 'Missed cardiology follow-up due to highway closure. Patient stable but needs rescheduling.',
    priority: 'high' as const,
    status: 'missed' as const,
    facilityId: 'regional-hospital' as const,
    referralType: 'Cardiology',
    notes: 'Original appointment was during January storm. Family concerned about transportation.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function seedDatabase() {
  const db = await getDatabase();
  const existing = await db.referrals.find().exec();

  if (existing.length > 0) {
    console.log('Database already has data, skipping seed');
    return false;
  }

  const now = new Date().toISOString();

  for (const referral of sampleReferrals) {
    await db.referrals.insert({
      ...referral,
      id: uuidv4(),
      updatedAt: now,
      isSynced: Math.random() > 0.3, // 70% synced, 30% pending
    });
  }

  console.log('Database seeded with sample data');
  return true;
}

export async function clearDatabase() {
  const db = await getDatabase();
  const docs = await db.referrals.find().exec();
  for (const doc of docs) {
    await doc.remove();
  }
  console.log('Database cleared');
}
