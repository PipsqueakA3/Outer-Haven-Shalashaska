import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }

  @Post('otp/request')
  otpPlaceholder() {
    return { status: 'prepared', message: 'OTP модуль подготовлен для email/telegram интеграции' };
  }
}
