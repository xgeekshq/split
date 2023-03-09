import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import ResetPassword from '../entities/reset-password.schema';

export interface ResetPasswordRepositoryInterface extends BaseInterfaceRepository<ResetPassword> {
	updateToken(
		emailAddress: string,
		genToken: string,
		withSession?: boolean
	): Promise<ResetPassword>;

	findPassword(emailAddress: string): Promise<ResetPassword>;
}
