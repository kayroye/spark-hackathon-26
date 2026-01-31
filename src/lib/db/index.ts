import { createRxDatabase, RxDatabase, RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Referral, referralSchema } from './schema';

type ReferralCollection = RxCollection<Referral>;

interface DatabaseCollections {
  referrals: ReferralCollection;
}

type ReferralLoopDatabase = RxDatabase<DatabaseCollections>;

let dbPromise: Promise<ReferralLoopDatabase> | null = null;

export async function getDatabase(): Promise<ReferralLoopDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = createRxDatabase<DatabaseCollections>({
    name: 'referralloop',
    storage: getRxStorageDexie(),
  }).then(async (db) => {
    await db.addCollections({
      referrals: {
        schema: referralSchema,
      },
    });
    return db;
  });

  return dbPromise;
}

export type { ReferralLoopDatabase, ReferralCollection };
