import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { loginData, user } from './helpers/authHelper';
import {
  USER_NOT_FOUND,
  USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT,
} from '../src/auth/auth.constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  afterAll(async () => {
    await userService.deleteAll();
    await app.close();
  });

  beforeEach(async () => {
    await userService.deleteAll();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  describe('When trying login in and return access and refresh tokens', () => {
    it('should be success', async () => {
      await userService.createUser(user);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(HttpStatus.OK);

      expect(response.body.token.accessToken).toBeDefined();
    });
  });

  describe('When trying login but user not found', () => {
    it('should be error', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(USER_NOT_FOUND);
    });
  });

  describe('When trying login in and token is not generated', () => {
    it('should be error', async () => {
      await userService.createUser(user);
      const loginDataInv = {
        email: 'testAuth@mail.ru',
        password: 'invalidtest123',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDataInv)
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe(USER_PASSWORD_OR_EMAIL_IS_NOT_CORRECT);
    });
  });
});
