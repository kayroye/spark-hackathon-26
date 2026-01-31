'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RxDocument } from 'rxdb';
import { getDatabase } from './index';
import { Referral, Status } from './schema';

export function useReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function init() {
      const db = await getDatabase();
      subscription = db.referrals.find().$.subscribe((docs: RxDocument<Referral>[]) => {
        setReferrals(docs.map((doc: RxDocument<Referral>) => doc.toJSON() as Referral));
        setLoading(false);
      });
    }

    init();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const addReferral = async (data: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.referrals.insert({
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      synced: false,
    });
  };

  const updateReferral = async (id: string, updates: Partial<Referral>) => {
    const db = await getDatabase();
    const doc = await db.referrals.findOne(id).exec();
    if (doc) {
      await doc.patch({
        ...updates,
        updatedAt: new Date().toISOString(),
        synced: false,
      });
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    await updateReferral(id, { status });
  };

  const syncAll = async () => {
    const db = await getDatabase();
    const unsyncedDocs = await db.referrals.find({ selector: { synced: false } }).exec();
    for (const doc of unsyncedDocs) {
      await doc.patch({ synced: true });
    }
  };

  return { referrals, loading, addReferral, updateReferral, updateStatus, syncAll };
}
