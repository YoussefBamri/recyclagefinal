import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

class RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    // Ici on retournerait normalement un utilisateur créé ou un token.
    // Pour le démonstration, on renvoie un message simple.
    return { message: 'Utilisateur créé (simulation)', email: dto.email };
  }
}

export default AuthController;
