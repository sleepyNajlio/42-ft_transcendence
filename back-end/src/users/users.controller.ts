import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
  SetMetadata,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFilename } from './AvatarTools';
import { imageFileFilter } from './AvatarTools';
import { error } from 'console';

@Controller('user')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private Config: ConfigService,
  ) {}

  @SetMetadata('isPublic', true)
  @Get()
  async GetProfileData(@Req() req: Request) {
    // console.log("GetProfileData begin");
    if (req.cookies['TWOFA']) {
      return { twoFA: true };
    }
    if (req.cookies['JWT_TOKEN']) {
      const user = await this.UsersService.GetUserByToken(
        req.cookies['JWT_TOKEN'],
      );
      return user;
    } else if (req.cookies['USER']) {
      const user = await this.UsersService.GetUserByToken(req.cookies['USER']);
      return user;
    } else return {msg: "no cookies"};
  }

  // @SetMetadata('isPublic', true)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: editFilename,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  async addAvatar(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let user: any;
    if (request.cookies['JWT_TOKEN'])
      user = await this.UsersService.GetUserByToken(
        request.cookies['JWT_TOKEN'],
      );
    else user = await this.UsersService.GetUserByToken(request.cookies['USER']);
    await this.UsersService.UploadAvatar(user.id_player, file);
    // if upload is successful
    if (file) {
      console.log({ file });
      return `${this.Config.get('BACKEND_URL')}` + file.path;
    }
    return 'madazsh';
  }


  // @Get('/:id')
  // async getUserById(@Param() { id }: { id: string }) {
  //   console.log(id);
  //   const user = await this.UsersService.getUserById(Number(id));
  //   return user;
  // }

  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('logging out');
    if (req.cookies['JWT_TOKEN']) {
      res.cookie('JWT_TOKEN', '', { expires: new Date() });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/`);
      // return "Logge/d out";
    } else if (req.cookies['USER']) {
      res.cookie('USER', '', { expires: new Date() });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/`);
      // return "Logged out";
    } else throw new HttpException('No Cookies', HttpStatus.UNAUTHORIZED);
  }
}
