import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../strategy';
import { RoleGuard } from './RoleGuard';

export function AccessTokenGuard() {
  return UseGuards(AuthGuard(ACCESS_TOKEN_STRATEGY_NAME), RoleGuard);
}
