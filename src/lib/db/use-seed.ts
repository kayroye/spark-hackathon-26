'use client';

import { useState } from 'react';
import { seedDatabase, clearDatabase } from '../seed-data';

export function useSeed() {
  const [isSeeding, setIsSeeding] = useState(false);

  const seed = async () => {
    setIsSeeding(true);
    try {
      const seeded = await seedDatabase();
      return seeded;
    } finally {
      setIsSeeding(false);
    }
  };

  const clear = async () => {
    setIsSeeding(true);
    try {
      await clearDatabase();
    } finally {
      setIsSeeding(false);
    }
  };

  return { seed, clear, isSeeding };
}
