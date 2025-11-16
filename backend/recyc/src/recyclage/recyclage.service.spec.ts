import { Test, TestingModule } from '@nestjs/testing';
import { RecyclageService } from './recyclage.service';

describe('RecyclageService', () => {
  let service: RecyclageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecyclageService],
    }).compile();

    service = module.get<RecyclageService>(RecyclageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
