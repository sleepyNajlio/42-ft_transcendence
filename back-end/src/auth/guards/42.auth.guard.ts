import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FTAuthGuard extends AuthGuard('42') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

}
