import { Test, TestingModule } from '@nestjs/testing';
import { PrivatesController } from './privates.controller';

describe('PrivatesController', () => {
  let controller: PrivatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivatesController],
    }).compile();

    controller = module.get<PrivatesController>(PrivatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
