import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { loginData, user } from './helpers/authHelper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    await userService.deleteAll();
  });

  afterAll(async () => {
    await userService.deleteAll();
    await app.close();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  describe('When trying login in', () => {
    it('should be success', async () => {
      await userService.createUser(user);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(HttpStatus.OK);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('When trying login in and token is not generated', () => {
    it('should be error', async () => {
      await userService.createUser(user);
      const loginDataInv = {
        email: 'test@mail.ru',
        password: 'invalidtest123',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDataInv)
        .expect(HttpStatus.FORBIDDEN);
      expect(response.body.message).toBe('Could not generate access token');
    });
  });
});
