import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FileService } from '../src/file/file.service';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { userData, loginData } from './helpers/fileHelper';
import { UNAUTHORIZED } from '../src/user/user.constants';

describe('FileController (E2E)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let fileService: FileService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    fileService = moduleFixture.get<FileService>(FileService);
    await app.init();
  });

  afterAll(async () => {
    await authService.deleteAll();
    await userService.deleteAll();
    await fileService.deleteAll();
    await app.close();
  });

  beforeEach(async () => {
    await authService.deleteAll();
    await userService.deleteAll();
    await fileService.deleteAll();
  });

  describe('When uploading a file with admin role', () => {
    it('should be success', async () => {
      userData.role = 'admin';
      await userService.createUser(userData);

      const adminToken = await authService.login(loginData);

      const response = await request(app.getHttpServer())
        .post('/file')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .attach('file', 'uploads/1910e109e146.png')
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
    });
  });

  describe('When uploading a file with no admin role', () => {
    it('should be error', async () => {
      userData.role = 'user';
      await userService.createUser(userData);

      const userToken = await authService.login(loginData);

      const response = await request(app.getHttpServer())
        .post('/file')
        .set('Authorization', `Bearer ${userToken.accessToken}`)
        .attach('file', 'uploads/1910e109e146.png')
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe(UNAUTHORIZED);
    });
  });
});
