import { Test, TestingModule } from '@nestjs/testing';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';

describe('ActionsGateway', () => {
	let gateway: SocketGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SocketGateway]
		}).compile();

		gateway = module.get<SocketGateway>(SocketGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
