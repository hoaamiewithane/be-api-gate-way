import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AUTH_MICROSERVICE } from 'src/constants';
import { CreateUserDto } from './dto/create-auth.dto';
import { SignInUserDto } from './dto/sign-in-auth.dto';

interface createUserResponse {
  message: string;
}
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly gateWayClient: ClientKafka,
  ) {}

  createUser(data: CreateUserDto) {
    return this.gateWayClient.send<createUserResponse, CreateUserDto>(
      'create_user',
      data,
    );
  }

  signInUser(data: SignInUserDto) {
    return this.gateWayClient.send<createUserResponse, SignInUserDto>(
      'sign_in_user',
      data,
    );
  }

  getMe(email: string) {
    return this.gateWayClient.send('get_me', email);
  }

  loginWithGoogle(payload: string) {
    return this.gateWayClient.send('login_with_google', payload);
  }

  async onModuleInit() {
    this.gateWayClient.subscribeToResponseOf('create_user');
    this.gateWayClient.subscribeToResponseOf('sign_in_user');
    this.gateWayClient.subscribeToResponseOf('get_me');
    this.gateWayClient.subscribeToResponseOf('login_with_google');
    await this.gateWayClient.connect();
  }
}
