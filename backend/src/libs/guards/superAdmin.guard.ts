import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const user = request.user;

		try {
			return user.isSAdmin;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
