import { Body, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { loginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiController('auth', { auth: true })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login to the system' })
  async login(@Body() loginDto: loginDto, @Req() req: any) {
    return this.authService.login(req.user);
  }
}
