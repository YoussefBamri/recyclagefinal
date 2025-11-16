import { Test, TestingModule } from '@nestjs/testing';
import { DefisController } from './defis.controller';
import { DefisService } from './defis.service';

describe('DefisController', () => {
  let controller: DefisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefisController],
      providers: [DefisService],
    }).compile();

    controller = module.get<DefisController>(DefisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
