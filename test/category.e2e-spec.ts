import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CategoryService } from '../src/category/category.service';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { userDataCat, loginDataCat } from './helpers/categoryHelper';
import { UNAUTHORIZED } from '../src/user/user.constants';
import { CATEGORY_FOR_THIS_ID_NOT_FOUND } from '../src/category/category.constants';

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

  describe('When updating a category with admin role', () => {
    it('should be success', async () => {
      userDataCat.role = 'admin';
      await userService.createUser(userDataCat);

      const accessToken = await authService.login(loginDataCat);
      const categorydto = {
        name: 'test',
      };
      const createCategoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken.accessToken}`)
        .send(categorydto);

      categorydto.name = 'updateCategory';

      const updateCategoryResponse = await request(app.getHttpServer())
        .put(`/category/${createCategoryResponse.body._id}`)
        .set('Authorization', `Bearer ${accessToken.accessToken}`)
        .send(categorydto);

      expect(updateCategoryResponse.body).toBeDefined();
      expect(updateCategoryResponse.body.name).toBe(categorydto.name);
    });
  });

  describe('When updating a category with no admin role', () => {
    it('should be error', async () => {
      userDataCat.role = 'user';
      await userService.createUser(userDataCat);

      const accessToken = await authService.login(loginDataCat);
      const categorydto = {
        name: 'test',
      };
      const createCategoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken.accessToken}`)
        .send(categorydto);

      categorydto.name = 'updateCategory';

      const updateCategoryResponse = await request(app.getHttpServer())
        .put(`/category/${createCategoryResponse.body._id}`)
        .set('Authorization', `Bearer ${accessToken.accessToken}`)
        .send(categorydto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateCategoryResponse.body.message).toBe(UNAUTHORIZED);
    });
  });

  describe('When updating a category , but category not found', () => {
    it('should be error', async () => {
      userDataCat.role = 'admin';
      await userService.createUser(userDataCat);

      const accessToken = await authService.login(loginDataCat);
      const categorydto = {
        name: 'test',
      };
      const invalidId = '65a0e17efe87d68ad57f8ffe';

      const updateCategoryResponse = await request(app.getHttpServer())
        .put(`/category/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken.accessToken}`)
        .send(categorydto);

      expect(updateCategoryResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(updateCategoryResponse.body.message).toBe(
        CATEGORY_FOR_THIS_ID_NOT_FOUND,
      );
    });
  });
});
