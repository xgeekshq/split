import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		try {
			return request.user.isSAdmin;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
