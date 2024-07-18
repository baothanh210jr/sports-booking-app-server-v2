import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginPayload, RegisterDto, ChangePasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService
    ) { }

    private getJwtSecret(): string {
        const secret = this.configService.get<string>('SECRET_KEY');
        if (!secret) {
            throw new Error('JWT secret key is not defined');
        }
        return secret;
    }

    private async generateAccessToken(email: string, sub: string): Promise<string> {
        const payload = { email, sub };
        return this.jwtService.sign(payload, { secret: this.getJwtSecret() });
    }

    decodeToken(token: string) {
        try {
            return this.jwtService.verify(token, { secret: this.getJwtSecret() });
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({
            $or: [{ email: username }, { phone: username }, { username }]
        });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async validateUserToken(token: string, optional: boolean = false) {
        const decodedToken: any = this.decodeToken(token);
        const userEmail = decodedToken?.email;
        if (!userEmail) {
            if (optional) return null;
            throw new UnauthorizedException('Token invalid!');
        }
        const user = await this.usersService.findOne({ email: userEmail });

        if (!user) {
            if (optional) return null;
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async login(payload: LoginPayload) {
        try {
            const { username, password } = payload;
            const user = await this.validateUser(username, password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            if (user.status !== 'active') {
                throw new UnauthorizedException('Account is not active. Please verify your email.');
            }
            const token = await this.generateAccessToken(user.email, user._id);
            return { access_token: token };
        } catch (error) {
            throw new UnauthorizedException('Login failed');
        }
    }

    async register(payload: RegisterDto) {
        const { email, username, name, password, phone, role } = payload;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = {
            email,
            username,
            name,
            password: hashedPassword,
            phone,
            role,
            status: 'inactive', // Set account status to inactive
            otp,
        };

        try {
            const user = await this.usersService.create(newUser);
            // Send OTP via email
            await this.emailService.sendMail(
                user.email,
                'Verify Your Email',
                `Your OTP is ${otp}`,
                `<h1>Verify Your Email</h1><p>Your OTP is <b>${otp}</b></p>`,
            );
            return { message: 'Registration successful. Please check your email for OTP to verify your account.' };
        } catch (error) {
            throw new Error('Registration failed');
        }
    }

    async verifyOtp(email: string, otp: string) {
        const user = await this.usersService.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid OTP');
        }
        user.status = 'active';
        //@ts-ignore
        await this.usersService.update(user._id, { status: 'active' })
        return { message: 'Account verified successfully' };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const user = await this.usersService.findById(userId);

        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await this.usersService.update(user._id, user);
            return { message: 'Password changed successfully' };
        } else {
            throw new UnauthorizedException('Old password is incorrect');
        }
    }
}
