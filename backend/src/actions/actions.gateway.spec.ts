import { Test, TestingModule } from '@nestjs/testing';
import ActionsGateway from './actions.gateway';

describe('ActionsGateway', () => {
  let gateway: ActionsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsGateway],
    }).compile();

    gateway = module.get<ActionsGateway>(ActionsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
