import { Test, TestingModule } from '@nestjs/testing';
import { PrivatesService } from './privates.service';

describe('PrivatesService', () => {
  let service: PrivatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivatesService],
    }).compile();

    service = module.get<PrivatesService>(PrivatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
