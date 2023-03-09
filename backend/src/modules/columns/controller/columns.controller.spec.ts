import { createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import * as Column from 'src/modules/columns/interfaces/types';
import { UpdateColumnApplication } from '../applications/update.columns.application';
import ColumnsController from './columns.controller';

describe('ColumnsController', () => {
	let controller: ColumnsController;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [EventEmitterModule.forRoot()],
			controllers: [ColumnsController],
			providers: [
				{
					provide: Column.TYPES.applications.UpdateColumnApplication,
					useValue: createMock<UpdateColumnApplication>()
				}
			]
		})
			.overrideGuard(BoardUserGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = module.get<ColumnsController>(ColumnsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
