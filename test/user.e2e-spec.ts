import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { UserModel } from '../src/user/user.model';
import { BcryptService } from '../src/auth/bcrypt.service';
import { userData } from './helpers/userHelper';
// import { USER_WITH_THIS_EMAIL } from '../src/user/user.constants';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let bcryptService: BcryptService;

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
      console.log('----', response.body);

      expect(response.body.password).toBeDefined();
      expect(response.body.name).toBe(user.name);
      expect(response.body.lastname).toBe(user.lastname);
      expect(response.body.email).toBe(user.email);
      expect(response.body.phone).toBe(user.phone);
      expect(response.body.address).toBe(user.address);
    });
  });

  // describe('When trying to register new user and user email already exist', () => {
  //   it('should be error', async () => {
  //     await userService.createUser(userData);

  //     const loginData = {
  //       email: 'testing@mail.ru',
  //       password: 'test123',
  //       name: 'name',
  //       lastname: 'lastname',
  //     };

  //     const response = await request(app.getHttpServer())
  //       .post('/user/register')
  //       .send(loginData)
  //       .expect(HttpStatus.BAD_REQUEST);

  //     expect(response.body.message).toBe(USER_WITH_THIS_EMAIL);
  //   });
  // });
});
