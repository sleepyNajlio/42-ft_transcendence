import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FTAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    try {
      console.log('FTAuthGuard canActivate');
      
      const activate = (await super.canActivate(context)) as boolean;
      console.log('salam 1');
      const request = context.switchToHttp().getRequest();

      // console.log(request.user);
      await super.logIn(request);
      console.log('salam 2');
      // console.log(request.user);
      return activate;
    } catch (error) {
      console.log(error);
    }
  }
}
