import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_MICROSERVICE, MRV_PORT } from 'src/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_MICROSERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [`localhost:${MRV_PORT}`],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRECT_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
