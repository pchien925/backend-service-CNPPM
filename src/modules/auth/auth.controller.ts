import { Body, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { loginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { TokenDto } from '../account/dtos/token.dto';

@ApiController('auth', { auth: true })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() dto: loginDto, @Req() req: any): Promise<ApiResponse<TokenDto>> {
    const token = await this.authService.login(req.user);
    return ApiResponse.success(token, 'Login success', HttpStatus.OK);
  }

  // REGISTER
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return ApiResponse.success(
      result,
      'Registration successful. Please check your email.',
      HttpStatus.CREATED,
    );
  }

  // VERIFY OTP
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(dto);
    return ApiResponse.success(result, 'Email verified successfully', HttpStatus.OK);
  }

  // RESEND OTP
  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    const result = await this.authService.resendOtp(dto);
    return ApiResponse.success(result, 'OTP resent successfully', HttpStatus.OK);
  }

  // FORGOT PASSWORD
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return ApiResponse.success(result, 'Password reset OTP sent successfully', HttpStatus.OK);
  }

  // RESET PASSWORD
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return ApiResponse.success(result, 'Password reset successfully', HttpStatus.OK);
  }

  // LOGOUT
  @Post('logout')
  @ApiOperation({ summary: 'Logout user - invalidate token' })
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
    return ApiResponse.successMessage('Logout successful');
  }
}
