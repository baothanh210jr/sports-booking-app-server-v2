import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '7d' },
    }),
    DatabaseModule,
    forwardRef(() => UsersModule),

  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule { }
