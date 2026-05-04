export { createSupabaseClient } from "./supabase/createSupabaseClient";

export { getGames, getGameById } from "./services/games.service";
export {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  recoverSessionWithOtpToken,
  recoverSessionWithTokens,
  updatePassword,
  verifyCurrentPassword,
  logout,
  getAuthenticatedUserId,
  getAuthenticatedUser,
  subscribeToAuthState,
} from "./services/auth.service";
export { createMatch, getActiveMatch } from "./services/matches.service";
export type { ActiveMatch } from "./services/matches.service";
export { getUserGameScore } from "./services/scores.service";
export { registrarPuntos } from "./services/ranking.service";
export {
  getAccountProfile,
  updateAccountProfile,
  getAccountRecentGames,
  getAccountFriends,
} from "./services/account.service";
export {
  reportUser,
  searchReportableUsers,
  reportGame,
  searchReportableGames,
  getUserReports,
  getUserGameReports,
} from "./services/reports.service";
export { createSupportTicket, getUserSupportTickets } from "./services/tickets.service";

export type { Game } from "./types/game";
export type { AccountProfile, AccountRecentGame, AccountFriend } from "./types/account";
export type { ReportableUser, ReportableGame, UserReport, GameReport } from "./services/reports.service";
export type { CreateSupportTicketInput, CreateSupportTicketResult, SupportTicket } from "./services/tickets.service";
