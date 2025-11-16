import { Test, TestingModule } from '@nestjs/testing';
import { DefisService } from './defis.service';

describe('DefisService', () => {
  let service: DefisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefisService],
    }).compile();

    service = module.get<DefisService>(DefisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
