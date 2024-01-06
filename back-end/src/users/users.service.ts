import { Injectable , HttpException, HttpStatus} from '@nestjs/common';
import { SignUpDTO, FinishSignUpDTO } from './dto/SignUp.dto';
import { PrismaService} from '../prisma/prisma.service';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username},
    });
    // if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email},
    });
    // if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async signUp(SignUpDTO: SignUpDTO) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: SignUpDTO.email }
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT) ;
    }
    const user = await this.prisma.user.create({
      data: SignUpDTO,
    });
    
    return user;
  }

  async finishSignUp(dto: SignUpDTO) {
    let userExists = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (userExists.isAuthenticated) {
      throw new HttpException('User already authenticated', HttpStatus.CONFLICT) ;
    }
    userExists = await this.updateProfile({
      email: dto.email,
      username: dto.username,
      avatar: dto.avatar,
      isAuthenticated: true,
    });
    return userExists;
  }


  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async updateProfile(FinishSignUpDTO: FinishSignUpDTO) {
    let userExists = await this.prisma.user.findUnique({
      where: { email: FinishSignUpDTO.email }
    });
    if (!userExists) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND) ;
    }
    
    const user = await this.prisma.user.update({
      where: { email: FinishSignUpDTO.email },
      data: FinishSignUpDTO,
    });
    return user;
  }

}