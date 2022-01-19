import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../strategy';
import { RoleGuard } from './RoleGuard';

export function RefreshTokenGuard() {
  return UseGuards(AuthGuard(REFRESH_TOKEN_STRATEGY_NAME), RoleGuard);
}
