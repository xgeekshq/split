import { Inject, Injectable } from '@nestjs/common';
import { CreateResetTokenAuthApplicationInterface } from '../interfaces/applications/create-reset-token.auth.application.interface';
import { CreateResetTokenAuthServiceInterface } from '../interfaces/services/create-reset-token.auth.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateResetTokenAuthApplication implements CreateResetTokenAuthApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateResetTokenAuthService)
		private createResetTokenAuthService: CreateResetTokenAuthServiceInterface
	) {}

	create(emailAddress: string) {
		return this.createResetTokenAuthService.create(emailAddress);
	}
}
