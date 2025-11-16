import { Test, TestingModule } from '@nestjs/testing';
import { RecyclageController } from './recyclage.controller';

describe('RecyclageController', () => {
  let controller: RecyclageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecyclageController],
    }).compile();

    controller = module.get<RecyclageController>(RecyclageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
