export interface StatisticsAuthUserUseCaseInterface {
	execute(userId: string): Promise<{ usersCount: number; teamsCount: number; boardsCount: number }>;
}
