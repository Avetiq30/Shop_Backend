import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private allowedRoles: string[];

  constructor(allowedRoles: string[] = []) {
    super();
    this.allowedRoles = allowedRoles;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (
      this.allowedRoles.length > 0 &&
      !this.matchRoles(user.role, this.allowedRoles)
    ) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return user;
  }

  private matchRoles(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
  }
}
