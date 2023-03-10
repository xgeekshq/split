import { Module, forwardRef } from '@nestjs/common';
import { mongooseBoardModule } from 'src/infrastructure/database/mongoose.module';
import SocketModule from 'src/modules/socket/socket.module';
import { CardsModule } from '../cards/cards.module';
import {
	commentRepository,
	createCommentApplication,
	createCommentService,
	deleteCommentApplication,
	deleteCommentService,
	updateCommentApplication,
	updateCommentService
} from './comment.providers';
import CommentsController from './controller/comments.controller';

@Module({
	imports: [mongooseBoardModule, forwardRef(() => SocketModule), CardsModule],
	controllers: [CommentsController],
	providers: [
		createCommentApplication,
		createCommentService,
		updateCommentService,
		updateCommentApplication,
		deleteCommentApplication,
		deleteCommentService,
		commentRepository
	],
	exports: []
})
export class CommentsModule {}
