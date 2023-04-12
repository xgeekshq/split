import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import User from 'src/modules/users/entities/user.schema';

@Injectable()
export class DeleteUserGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const user: User = request.user;
		const userToDelete: string = request.params.userId;

		// user requesting can't delete itself
		return user._id !== userToDelete;
	}
}
