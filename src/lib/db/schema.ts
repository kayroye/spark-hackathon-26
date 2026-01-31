import { RxJsonSchema } from 'rxdb';

// User types
export type UserRole = 'nurse' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string; // Only for nurses
  createdAt: string;
}

export interface MagicLinkToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
}

export const userSchema: RxJsonSchema<User> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string', maxLength: 320 },
    name: { type: 'string' },
    role: { type: 'string', enum: ['nurse', 'patient'] },
    passwordHash: { type: 'string' },
    createdAt: { type: 'string' },
  },
  required: ['id', 'email', 'name', 'role', 'createdAt'],
  indexes: ['email'],
};

export const magicLinkTokenSchema: RxJsonSchema<MagicLinkToken> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string', maxLength: 320 },
    token: { type: 'string', maxLength: 1024 },
    expiresAt: { type: 'string' },
    used: { type: 'boolean' },
  },
  required: ['id', 'email', 'token', 'expiresAt', 'used'],
  indexes: ['token', 'email'],
};

export const FACILITIES = [
  { id: 'regional-hospital', name: 'Regional Hospital', distance: '110km', types: ['Emergency', 'Surgery', 'Cardiology'] },
  { id: 'mental-health-center', name: 'Northern Mental Health Center', distance: '85km', types: ['Mental Health', 'Counseling'] },
  { id: 'specialist-clinic', name: 'Lakeview Specialist Clinic', distance: '95km', types: ['Cardiology', 'Oncology', 'Neurology'] },
  { id: 'community-health', name: 'Clearwater Nursing Station', distance: 'Local', types: ['Primary Care', 'Follow-up'] },
] as const;

export type FacilityId = typeof FACILITIES[number]['id'];
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'pending' | 'scheduled' | 'completed' | 'missed';

export interface StatusChangeNote {
  fromStatus: string;
  toStatus: string;
  note: string;
  changedAt: string;
  wasOverdue: boolean;
}

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
  isSynced: boolean;
  statusChangeNotes?: StatusChangeNote[];
}

export type ReferralWithMeta = Referral & {
  daysSinceCreated: number;
  isOverdue: boolean;
};

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
    isSynced: { type: 'boolean' },
    statusChangeNotes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fromStatus: { type: 'string' },
          toStatus: { type: 'string' },
          note: { type: 'string' },
          changedAt: { type: 'string' },
          wasOverdue: { type: 'boolean' },
        },
      },
    },
  },
  required: ['id', 'patientName', 'diagnosis', 'priority', 'status', 'facilityId', 'referralType', 'createdAt', 'updatedAt', 'isSynced'],
};
