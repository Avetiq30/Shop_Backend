import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';
import { UserModel } from '../src/user/user.model';
import { BcryptService } from '../src/auth/bcrypt.service';
import { userData, loginData } from './helpers/userHelper';
import { UNAUTHORIZED, USER_WITH_THIS_EMAIL } from '../src/user/user.constants';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let bcryptService: BcryptService;

  afterAll(async () => {
    await userService.deleteAll();
    await authService.deleteAll();
    await app.close();
  });
  beforeEach(async () => {
    await userService.deleteAll();
    await authService.deleteAll();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    bcryptService = moduleFixture.get<BcryptService>(BcryptService);
    await app.init();
  });

  describe('When trying registering a new user', () => {
    it('should be success', async () => {
      const hashedPassword = await bcryptService.hashPassword(
        userData.password,
        10,
      );
      const user: UserModel = {
        ...userData,
        password: hashedPassword,
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(userData);
      expect(HttpStatus.OK);

      expect(response.body.password).toBeDefined();
      expect(response.body.name).toBe(user.name);
      expect(response.body.lastname).toBe(user.lastname);
      expect(response.body.email).toBe(user.email);
      expect(response.body.phone).toBe(user.phone);
      expect(response.body.address).toBe(user.address);
    });
  });

  describe('When trying to register new user and user email already exist', () => {
    it('should be error', async () => {
      await userService.createUser(userData);

      const loginData = {
        email: 'testing@mail.ru',
        password: 'test123123',
        name: 'name',
        lastname: 'lastname',
        role: undefined,
        phone: '1234567890',
        address: 'erevan',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(loginData)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(USER_WITH_THIS_EMAIL);
    });
  });

  describe('When trying to get all users with admin role', () => {
    it('should be success', async () => {
      userData.role = 'admin';
      await userService.createUser(userData);

      const adminToken = await authService.login(loginData);

      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('When trying to get all users with no admin role', () => {
    it('should be error', async () => {
      userData.role = 'user';

      await userService.createUser(userData);

      const userToken = await authService.login(loginData);

      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${userToken.accessToken}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe(UNAUTHORIZED);
    });
  });

  describe('When trying to get user by id', () => {
    it('should be success', async () => {
      const createdUser: any = await userService.createUser(userData);

      const response = await request(app.getHttpServer())
        .get(`/user/${createdUser._id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(createdUser._id.toString());
      expect(response.body.name).toBe(createdUser.name);
      expect(response.body.lastname).toBe(createdUser.lastname);
      expect(response.body.email).toBe(createdUser.email);
      expect(response.body.phone).toBe(createdUser.phone);
      expect(response.body.address).toBe(createdUser.address);
    });
  });
});
