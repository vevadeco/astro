import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  BirthProfile,
  DailySummary,
  LuckyFactors,
  MonthCalendarData,
  NatalChart,
  PersistenceError,
  UnluckyFactors,
  ZodiacSign,
} from '../models/types';
import { profilePersistence } from '../persistence/profilePersistence';
import { calculate } from '../services/natalChartService';
import { deriveLuckyFactors, deriveUnluckyFactors } from '../services/factorsService';
import { getMonthDates } from '../services/calendarService';
import { generateDailySummary } from '../services/dailySummaryService';
import { determineSign, getSignDescription } from '../services/zodiacService';

export interface AppState {
  profile: BirthProfile | null;
  zodiacSign: ZodiacSign | null;
  signDescription: string;
  natalChart: NatalChart | null;
  luckyFactors: LuckyFactors | null;
  unluckyFactors: UnluckyFactors | null;
  monthCalendar: MonthCalendarData | null;
  dailySummary: DailySummary | null;
  monthOffset: number;
  isLoading: boolean;
  loadError: PersistenceError | null;
  saveError: PersistenceError | null;
  factorsError: string | null;
}

export interface AppContextValue extends AppState {
  saveProfile: (profile: BirthProfile) => boolean;
  deleteProfile: () => void;
  setMonthOffset: (offset: number) => void;
  clearSaveError: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function computeAstrologicalData(profile: BirthProfile, monthOffset: number) {
  const zodiacSign = determineSign(profile.dateOfBirth);
  const signDescription = getSignDescription(zodiacSign);
  const natalChart = calculate(profile);

  let luckyFactors: LuckyFactors | null = null;
  let unluckyFactors: UnluckyFactors | null = null;
  let factorsError: string | null = null;

  try {
    luckyFactors = deriveLuckyFactors(zodiacSign, natalChart);
    unluckyFactors = deriveUnluckyFactors(zodiacSign, natalChart);
  } catch {
    factorsError = 'Unable to derive astrological factors. Please verify your birth details.';
  }

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthCalendar = getMonthDates(
    target.getFullYear(),
    target.getMonth() + 1,
    natalChart,
  );

  const dailySummary =
    luckyFactors && unluckyFactors
      ? generateDailySummary(natalChart, luckyFactors, unluckyFactors)
      : null;

  return {
    zodiacSign,
    signDescription,
    natalChart,
    luckyFactors,
    unluckyFactors,
    monthCalendar,
    dailySummary,
    factorsError,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [monthOffset, setMonthOffsetState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<PersistenceError | null>(null);
  const [saveError, setSaveError] = useState<PersistenceError | null>(null);
  const [astro, setAstro] = useState<ReturnType<typeof computeAstrologicalData> | null>(null);

  useEffect(() => {
    const result = profilePersistence.load();
    if (!result.ok) {
      setLoadError(result.error);
      profilePersistence.delete();
    } else if (result.value) {
      setProfile(result.value);
      setAstro(computeAstrologicalData(result.value, 0));
    }
    setIsLoading(false);
  }, []);

  const saveProfile = useCallback((newProfile: BirthProfile): boolean => {
    const result = profilePersistence.save(newProfile);
    if (!result.ok) {
      setSaveError(result.error);
      return false;
    }
    setSaveError(null);
    setLoadError(null);
    setProfile(newProfile);
    setAstro(computeAstrologicalData(newProfile, monthOffset));
    return true;
  }, [monthOffset]);

  const deleteProfile = useCallback(() => {
    profilePersistence.delete();
    setProfile(null);
    setAstro(null);
    setLoadError(null);
    setSaveError(null);
    setMonthOffsetState(0);
  }, []);

  const setMonthOffset = useCallback(
    (offset: number) => {
      setMonthOffsetState(offset);
      if (profile) {
        setAstro(computeAstrologicalData(profile, offset));
      }
    },
    [profile],
  );

  const clearSaveError = useCallback(() => setSaveError(null), []);

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      zodiacSign: astro?.zodiacSign ?? null,
      signDescription: astro?.signDescription ?? '',
      natalChart: astro?.natalChart ?? null,
      luckyFactors: astro?.luckyFactors ?? null,
      unluckyFactors: astro?.unluckyFactors ?? null,
      monthCalendar: astro?.monthCalendar ?? null,
      dailySummary: astro?.dailySummary ?? null,
      monthOffset,
      isLoading,
      loadError,
      saveError,
      factorsError: astro?.factorsError ?? null,
      saveProfile,
      deleteProfile,
      setMonthOffset,
      clearSaveError,
    }),
    [
      profile,
      astro,
      monthOffset,
      isLoading,
      loadError,
      saveError,
      saveProfile,
      deleteProfile,
      setMonthOffset,
      clearSaveError,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
