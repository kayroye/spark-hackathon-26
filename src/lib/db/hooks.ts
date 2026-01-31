'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RxDocument } from 'rxdb';
import { getDatabase } from './index';
import { Referral, ReferralWithMeta, Status, StatusChangeNote } from './schema';

export function useReferrals() {
  const [referrals, setReferrals] = useState<ReferralWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function init() {
      const db = await getDatabase();
      subscription = db.referrals.find().$.subscribe((docs: RxDocument<Referral>[]) => {
        const now = Date.now();
        setReferrals(docs.map((doc: RxDocument<Referral>) => {
          const referral = doc.toJSON() as Referral;
          const createdDate = new Date(referral.createdAt);
          const daysSinceCreated = Math.floor(
            (now - createdDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          return {
            ...referral,
            daysSinceCreated,
            isOverdue: referral.status === 'pending' && daysSinceCreated >= 14,
          };
        }));
        setLoading(false);
      });
    }

    init();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const addReferral = async (data: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>) => {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.referrals.insert({
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      isSynced: false,
    });
  };

  const updateReferral = async (id: string, updates: Partial<Referral>) => {
    const db = await getDatabase();
    const doc = await db.referrals.findOne(id).exec();
    if (doc) {
      await doc.patch({
        ...updates,
        updatedAt: new Date().toISOString(),
        isSynced: false,
      });
    }
  };

  const updateStatus = async (id: string, status: Status, note?: string) => {
    const db = await getDatabase();
    const doc = await db.referrals.findOne(id).exec();
    if (doc) {
      const currentReferral = doc.toJSON() as Referral;
      const updates: Partial<Referral> = { status };

      if (note) {
        const createdDate = new Date(currentReferral.createdAt);
        const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const wasOverdue = currentReferral.status === 'pending' && daysSinceCreated >= 14;

        const statusChangeNote: StatusChangeNote = {
          fromStatus: currentReferral.status,
          toStatus: status,
          note,
          changedAt: new Date().toISOString(),
          wasOverdue,
        };

        const existingNotes = currentReferral.statusChangeNotes || [];
        updates.statusChangeNotes = [...existingNotes, statusChangeNote];
      }

      await updateReferral(id, updates);
    }
  };

  const syncAll = async () => {
    const db = await getDatabase();
    const unsyncedDocs = await db.referrals.find({ selector: { isSynced: false } }).exec();
    for (const doc of unsyncedDocs) {
      await doc.patch({ isSynced: true });
    }
  };

  return { referrals, loading, addReferral, updateReferral, updateStatus, syncAll };
}
