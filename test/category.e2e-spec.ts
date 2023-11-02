import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CategoryService } from '../src/category/category.service';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';

describe('CategoryController (E2E)', () => {
  let app: INestApplication;
  let categoryService: CategoryService;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    categoryService = moduleFixture.get<CategoryService>(CategoryService);
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
    await userService.deleteAll();
    await categoryService.deleteAll();
  });

  async function userAndAuthFunction() {
    const userData = {
      name: 'test',
      lastname: 'tests',
      email: 'testcategory@mail.ru',
      password: '00000',
    };
    const createUser = await userService.createUser(userData);
    return authService.login({
      email: userData.email,
      password: userData.password,
    });
  }

  afterEach(async () => {
    await categoryService.deleteAll();
    await userService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When create a category', () => {
    let token;
    beforeAll(async () => {
      token = await userAndAuthFunction();
    });
    it('should be succes', async () => {
      const createCategoryDto = {
        name: 'testCategory',
      };
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(createCategoryDto);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.name).toBe(createCategoryDto.name);
    });
  });
});
