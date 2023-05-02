import { Module, forwardRef } from '@nestjs/common';
import { mongooseBoardModule } from 'src/infrastructure/database/mongoose.module';
import SocketModule from 'src/modules/socket/socket.module';
import { CardsModule } from '../cards/cards.module';
import {
	commentRepository,
	createCommentUseCase,
	deleteCommentUseCase,
	updateCommentUseCase
} from './comment.providers';
import CommentsController from './controller/comments.controller';

@Module({
	imports: [mongooseBoardModule, forwardRef(() => SocketModule), CardsModule],
	controllers: [CommentsController],
	providers: [createCommentUseCase, deleteCommentUseCase, updateCommentUseCase, commentRepository],
	exports: []
})
export class CommentsModule {}
