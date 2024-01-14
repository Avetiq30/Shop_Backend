import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CategoryService } from '../src/category/category.service';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { userDataCat, loginDataCat } from './helpers/categoryHelper';
import { UNAUTHORIZED } from '../src/user/user.constants';

describe('CategoryController (E2E)', () => {
  let app: INestApplication;
  let categoryService: CategoryService;
  let authService: AuthService;
  let userService: UserService;

  afterAll(async () => {
    await authService.deleteAll();
    await userService.deleteAll();
    await categoryService.deleteAll();
    await app.close();
  });

  beforeEach(async () => {
    await userService.deleteAll();
    await authService.deleteAll();
    await categoryService.deleteAll();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    categoryService = moduleFixture.get<CategoryService>(CategoryService);
    await app.init();
  });

  describe('When creating a new category with admin role', () => {
    it('should be success', async () => {
      userDataCat.role = 'admin';
      await userService.createUser(userDataCat);

      const adminToken = await authService.login(loginDataCat);
      const createCategoryDto = {
        name: 'TestCategory',
      };

      const response = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send(createCategoryDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(createCategoryDto.name);
    });
  });

  describe('When getting all categories with admin role', () => {
    it('should be success', async () => {
      userDataCat.role = 'admin';
      await userService.createUser(userDataCat);

      const adminToken = await authService.login(loginDataCat);

      const response = await request(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('When trying to get all category with no admin role', () => {
    it('should be error', async () => {
      userDataCat.role = 'user';

      await userService.createUser(userDataCat);

      const userToken = await authService.login(loginDataCat);
      const response = await request(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${userToken.accessToken}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe(UNAUTHORIZED);
    });
  });
});
