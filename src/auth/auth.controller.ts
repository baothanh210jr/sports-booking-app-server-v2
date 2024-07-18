import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { CustomResponseInterceptor } from 'src/core/https/response';
import { ChangePasswordDto, LoginPayload, RegisterDto, VerifyOtpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiCustomBody, ApiCustomOperation, ApiCustomTags } from 'src/core/decorators/swagger.decorator';
import { UserSchema } from 'src/database/schemas/users';

@ApiCustomTags('Auth')
@Controller('auth')
// @UseInterceptors(CustomResponseInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiCustomOperation('Login a user')
    @ApiCustomBody(LoginPayload)
    @Post('/login')
    async login(@Body() payload: LoginPayload) {
        return this.authService.login(payload);
    }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto, })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @Post('/register')
    async register(@Body() payload: RegisterDto) {
        return this.authService.register(payload);
    }

    @ApiOperation({ summary: 'Change user password' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiParam({ name: 'userId' })
    @ApiResponse({ status: 200, description: 'Password successfully changed' })
    @Post('/change-password/:userId')
    async changePassword(@Param('userId') userId: string, @Body() payload: ChangePasswordDto) {
        return this.authService.changePassword(userId, payload);
    }

    @ApiOperation({ summary: 'Verify OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @ApiResponse({ status: 200, description: 'OTP successfully verified' })
    @Post('/verify-otp')
    async verifyOtp(@Body() payload: VerifyOtpDto) {
        return this.authService.verifyOtp(payload.email, payload.otp);
    }
}


