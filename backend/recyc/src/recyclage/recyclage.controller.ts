import { Controller, Post, Body } from '@nestjs/common';
import { RecyclageService } from './recyclage.service';

@Controller('recyclage')
export class RecyclageController {
  constructor(private readonly recyclageService: RecyclageService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const response = await this.recyclageService.getResponse(message);
    return { response };
  }
}
