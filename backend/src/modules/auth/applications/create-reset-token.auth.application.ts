import { Inject, Injectable } from '@nestjs/common';
import { CreateResetTokenAuthApplicationInterface } from '../interfaces/applications/create-reset-token.auth.application.interface';
import { TYPES } from '../interfaces/types';
import CreateResetTokenAuthService from '../services/create-reset-token.auth.service';

@Injectable()
export class CreateResetTokenAuthApplication implements CreateResetTokenAuthApplicationInterface {
	constructor(
		@Inject(TYPES.services.CreateResetTokenAuthService)
		private createResetTokenAuthService: CreateResetTokenAuthService
	) {}

	create(emailAddress: string) {
		return this.createResetTokenAuthService.create(emailAddress);
	}
}
