import { RxJsonSchema } from 'rxdb';

export const FACILITIES = [
  { id: 'regional-hospital', name: 'Regional Hospital', distance: '110km', types: ['Emergency', 'Surgery', 'Cardiology'] },
  { id: 'mental-health-center', name: 'Northern Mental Health Center', distance: '85km', types: ['Mental Health', 'Counseling'] },
  { id: 'specialist-clinic', name: 'Lakeview Specialist Clinic', distance: '95km', types: ['Cardiology', 'Oncology', 'Neurology'] },
  { id: 'community-health', name: 'Clearwater Nursing Station', distance: 'Local', types: ['Primary Care', 'Follow-up'] },
] as const;

export type FacilityId = typeof FACILITIES[number]['id'];
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'pending' | 'scheduled' | 'completed' | 'missed';

export interface Referral {
  id: string;
  patientName: string;
  patientPhone?: string;
  diagnosis: string;
  priority: Priority;
  status: Status;
  facilityId: FacilityId;
  referralType: string;
  appointmentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export const referralSchema: RxJsonSchema<Referral> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    patientName: { type: 'string' },
    patientPhone: { type: 'string' },
    diagnosis: { type: 'string' },
    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
    status: { type: 'string', enum: ['pending', 'scheduled', 'completed', 'missed'] },
    facilityId: { type: 'string' },
    referralType: { type: 'string' },
    appointmentDate: { type: 'string' },
    notes: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    synced: { type: 'boolean' },
  },
  required: ['id', 'patientName', 'diagnosis', 'priority', 'status', 'facilityId', 'referralType', 'createdAt', 'updatedAt', 'synced'],
};
