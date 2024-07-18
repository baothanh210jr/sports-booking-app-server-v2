import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SportsFieldsModule } from './sports-fields/sports-fields.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    SportsFieldsModule,
    BookingsModule,
    PaymentsModule,
    ConfigurationModule,
    FileModule,
    EmailModule,
  ],
})
export class AppModule { }
