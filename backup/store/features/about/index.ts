// About page feature exports
export { default as teamReducer } from './teamSlice';

// Export team actions
export {
  setLoading as setTeamLoading,
  setError as setTeamError,
  clearError as clearTeamError,
  clearTeamMembers,
  resetTeam,
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from './teamSlice';
