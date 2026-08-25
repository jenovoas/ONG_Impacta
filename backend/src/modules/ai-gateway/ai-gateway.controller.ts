import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../auth/decorators/public.decorator';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { PublicAssistantDto } from './dto/public-assistant.dto';

@Controller('assistant')
export class AiGatewayController {
  constructor(private readonly orchestrator: AiOrchestratorService) {}

  @Public()
  @Post('public')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  answerPublic(@Body() dto: PublicAssistantDto) {
    return this.orchestrator.answerPublic(dto);
  }
}
