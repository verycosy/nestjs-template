import { AuthService } from '@app/auth';
import { Role } from '@app/entity/domain/user/type/Role';
import { User } from '@app/entity/domain/user/User.entity';

export async function getAdminAccessToken(authService: AuthService) {
  const user = await authService.signUp(
    await User.signUp({
      name: 'admin',
      email: 'admin@admin.com',
      phoneNumber: '010-1111-2222',
      password: 'hello',
      role: Role.Admin,
    }),
  );

  const { accessToken } = await authService.generateJwtTokens({
    id: user.id,
  });

  return accessToken;
}
