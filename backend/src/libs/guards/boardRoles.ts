import BoardUser, { BoardUserDocument } from 'src/modules/boards/schemas/board.user.schema';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BoardUserGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@InjectModel(BoardUser.name) private BoardUserModel: Model<BoardUserDocument>
	) {}

	async canActivate(context: ExecutionContext) {
		const permission = this.reflector.get<string>('permission', context.getHandler());
		const request = context.switchToHttp().getRequest();

		const user = request.user;
		const boardId: string = request.params.boardId;
		try {
			const userFound = await this.BoardUserModel.findOne({
				user: user._id,
				board: boardId
			}).exec();

			const hasPermissions = permission === userFound?.role || user.isSAdmin;

			return hasPermissions;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
