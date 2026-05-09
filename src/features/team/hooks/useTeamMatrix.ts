// src/features/team/hooks/useTeamMatrix.ts
import { useQuery } from '@tanstack/react-query';
import { getTeamMatrix } from '../api/getTeamMatrix';
import type { TeamMatrix } from '../types';

export const useTeamMatrix = () => {
  return useQuery<TeamMatrix>({
    queryKey: ['team-matrix'],
    queryFn: getTeamMatrix,
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura

    // aquí iría lógica de retry específica, si fuera necesario
  });
};