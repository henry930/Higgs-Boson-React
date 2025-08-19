import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setTeamLoading,
  setTeamError,
  clearTeamError,
  clearTeamMembers,
  resetTeam,
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../../store/features/about';

export const useTeam = () => {
  const dispatch = useAppDispatch();
  const teamMembers = useAppSelector((state) => state.team.teamMembers);
  const loading = useAppSelector((state) => state.team.loading);
  const error = useAppSelector((state) => state.team.error);
  const lastFetched = useAppSelector((state) => state.team.lastFetched);

  return {
    teamMembers,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchTeamMembers()),
      create: (member: any) => dispatch(createTeamMember(member)),
      update: (id: number, member: any) => dispatch(updateTeamMember({ id, member })),
      delete: (id: number) => dispatch(deleteTeamMember(id)),
      setLoading: (loading: boolean) => dispatch(setTeamLoading(loading)),
      setError: (error: string | null) => dispatch(setTeamError(error)),
      clearError: () => dispatch(clearTeamError()),
      clearMembers: () => dispatch(clearTeamMembers()),
      reset: () => dispatch(resetTeam()),
    },
  };
};
