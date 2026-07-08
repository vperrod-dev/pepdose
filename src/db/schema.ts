import { type DBSchema, openDB, type IDBPDatabase } from 'idb';
import type { SchedulePhase } from '../data/peptides';
import type { UserName } from '../data/users';

export interface UserProtocol {
  id: string;
  owner: UserName;
  name: string;
  peptideIds: string[];
  doses: { peptideId: string; dose: number; unit: 'mcg' | 'mg'; frequency: string; timesPerDay?: number; timeOfDay: string; durationWeeks?: number; customFrequencyDays?: number; schedulePhases?: SchedulePhase[]; variantId?: string }[];
  startDate: string;
  durationWeeks: number;
  status: 'active' | 'paused' | 'completed' | 'archived';
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledDose {
  id: string;
  owner: UserName;
  protocolId: string;
  peptideId: string;
  date: string;
  time: string;
  dose: number;
  unit: 'mcg' | 'mg';
  route: string;
  status: 'upcoming' | 'logged' | 'missed' | 'skipped';
  suggestedSite?: string;
  isTitrationStepUp?: boolean;
  weekNumber: number;
  editNote?: string;
  updatedAt?: string;
}

export interface DoseLog {
  id: string;
  owner: UserName;
  scheduledDoseId?: string;
  protocolId: string;
  peptideId: string;
  date: string;
  time: string;
  dose: number;
  unit: 'mcg' | 'mg';
  route: string;
  injectionSite?: string;
  notes?: string;
  siteReaction?: 'redness' | 'lump' | 'pain' | 'bruise';
  // Systemic symptoms felt around this dose, each rated 1-10. Optional; older
  // logs simply omit it (no migration needed).
  symptoms?: { name: string; severity: number }[];
  createdAt: string;
  updatedAt?: string;
}

export interface Vial {
  id: string;
  owner: UserName;
  peptideId: string;
  amountMg: number;
  bacWaterMl: number;
  reconstitutionDate?: string;
  dosesRemaining: number;
  totalDoses: number;
  expirationDate?: string;
  storageLocation?: string;
  source?: string;
  batchNumber?: string;
  status: 'unreconstituted' | 'active' | 'empty' | 'expired';
  createdAt: string;
  updatedAt?: string;
}

export interface HealthMarker {
  id: string;
  owner: UserName;
  date: string;
  weight?: number;
  bodyFatPct?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  restingHR?: number;
  fastingGlucose?: number;
  mood?: number;
  energy?: number;
  sleepQuality?: number;
  sideEffects?: string;
  notes?: string;
  bloodwork?: Record<string, number>;
  measurements?: Record<string, number>;
  createdAt: string;
  updatedAt?: string;
}

export interface EditHistory {
  id: string;
  protocolId: string;
  field: string;
  oldValue: string;
  newValue: string;
  affectedDoses: number;
  date: string;
}

interface PepDoseDB extends DBSchema {
  protocols: {
    key: string;
    value: UserProtocol;
    indexes: { 'by-status': string };
  };
  scheduledDoses: {
    key: string;
    value: ScheduledDose;
    indexes: {
      'by-date': string;
      'by-protocol': string;
      'by-status': string;
      'by-peptide-date': [string, string];
    };
  };
  doseLogs: {
    key: string;
    value: DoseLog;
    indexes: {
      'by-date': string;
      'by-protocol': string;
      'by-peptide': string;
    };
  };
  vials: {
    key: string;
    value: Vial;
    indexes: {
      'by-peptide': string;
      'by-status': string;
    };
  };
  healthMarkers: {
    key: string;
    value: HealthMarker;
    indexes: { 'by-date': string };
  };
  editHistory: {
    key: string;
    value: EditHistory;
    indexes: { 'by-protocol': string };
  };
}

let dbInstance: IDBPDatabase<PepDoseDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PepDoseDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PepDoseDB>('pepdose', 2, {
    async upgrade(db, oldVersion, _newVersion, tx) {
      if (oldVersion < 1) {
        const protocolStore = db.createObjectStore('protocols', { keyPath: 'id' });
        protocolStore.createIndex('by-status', 'status');

        const doseStore = db.createObjectStore('scheduledDoses', { keyPath: 'id' });
        doseStore.createIndex('by-date', 'date');
        doseStore.createIndex('by-protocol', 'protocolId');
        doseStore.createIndex('by-status', 'status');
        doseStore.createIndex('by-peptide-date', ['peptideId', 'date']);

        const logStore = db.createObjectStore('doseLogs', { keyPath: 'id' });
        logStore.createIndex('by-date', 'date');
        logStore.createIndex('by-protocol', 'protocolId');
        logStore.createIndex('by-peptide', 'peptideId');

        const vialStore = db.createObjectStore('vials', { keyPath: 'id' });
        vialStore.createIndex('by-peptide', 'peptideId');
        vialStore.createIndex('by-status', 'status');

        const healthStore = db.createObjectStore('healthMarkers', { keyPath: 'id' });
        healthStore.createIndex('by-date', 'date');

        const editStore = db.createObjectStore('editHistory', { keyPath: 'id' });
        editStore.createIndex('by-protocol', 'protocolId');
      }

      if (oldVersion < 2) {
        // Backfill existing single-user data to Victor.
        const owned = ['protocols', 'scheduledDoses', 'doseLogs', 'vials', 'healthMarkers'] as const;
        for (const storeName of owned) {
          let cursor = await tx.objectStore(storeName).openCursor();
          while (cursor) {
            if (!(cursor.value as { owner?: UserName }).owner) {
              await cursor.update({ ...cursor.value, owner: 'Victor' });
            }
            cursor = await cursor.continue();
          }
        }
      }
    },
  });

  return dbInstance;
}
