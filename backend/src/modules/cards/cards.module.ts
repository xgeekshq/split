import { forwardRef, Module } from '@nestjs/common';
import { mongooseModule } from '../../infrastructure/database/mongoose.module';
import SocketModule from '../socket/socket.module';
import {
  createCardApplication,
  createCardService,
  deleteCardApplication,
  deleteCardService,
  getCardService,
  updateCardApplication,
  updateCardService,
} from './cards.providers';
import CardsController from './controller/cards.controller';

@Module({
  imports: [mongooseModule, forwardRef(() => SocketModule)],
  controllers: [CardsController],
  providers: [
    createCardService,
    updateCardService,
    getCardService,
    deleteCardService,
    updateCardService,
    createCardApplication,
    updateCardApplication,
    deleteCardApplication,
  ],
  exports: [],
})
export class CardsModule {}
