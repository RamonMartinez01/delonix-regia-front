import { useQuery } from '@tanstack/react-query';
import { getProject } from '../api/getProject';

export const useProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId, // Solo se dispara si tenemos el ID
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
  });
};