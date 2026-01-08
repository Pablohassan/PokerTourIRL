import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { API_ENDPOINTS } from "../config";

type UseRecentTournamentYearsResult = {
  years: number[];
  defaultYear: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const normalizeYears = (data: unknown): number[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item: any) => Number(item?.year))
    .filter((year) => Number.isFinite(year));
};

const uniqueSortedDesc = (years: number[]) => {
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

export const useRecentTournamentYears = (): UseRecentTournamentYearsResult => {
  const [years, setYears] = useState<number[]>([]);
  const [defaultYear, setDefaultYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const currentYear = new Date().getFullYear();

    try {
      const response = await api.get(API_ENDPOINTS.TOURNAMENTS);
      let fetchedYears = normalizeYears(response.data);

      if (!fetchedYears.includes(currentYear)) {
        try {
          const createResponse = await api.post(API_ENDPOINTS.TOURNAMENTS, {
            year: currentYear,
          });
          const createdYear = Number(createResponse.data?.year);
          fetchedYears = fetchedYears.concat(
            Number.isFinite(createdYear) ? createdYear : currentYear
          );
        } catch (createError) {
          try {
            const refreshResponse = await api.get(API_ENDPOINTS.TOURNAMENTS);
            fetchedYears = normalizeYears(refreshResponse.data);
          } catch {
            // Keep the fetched years if refresh fails
          }
        }
      }

      const recentYears = uniqueSortedDesc(fetchedYears).slice(0, 3);
      setYears(recentYears);
      setDefaultYear(
        recentYears.includes(currentYear) ? currentYear : recentYears[0] ?? null
      );
    } catch (fetchError) {
      setError("Failed to load tournament years.");
      const fallbackYears = [
        currentYear,
        currentYear - 1,
        currentYear - 2,
      ];
      setYears(fallbackYears);
      setDefaultYear(currentYear);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return {
    years,
    defaultYear,
    isLoading,
    error,
    refresh: fetchYears,
  };
};
