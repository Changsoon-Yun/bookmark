import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(authCredentialDto: AuthCredentialDto) {
    const { email, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const res = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });
      return res;
    } catch (err) {
      if (err.code === "P2002") {
        throw new ConflictException("Existing username");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authCredentialDto: AuthCredentialDto) {
    const { email, password } = authCredentialDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return "Login Success";
    } else {
      throw new UnauthorizedException("Login Failed");
    }
  }
}