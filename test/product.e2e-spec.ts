import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductService } from '../src/product/product.service';
import { CategoryService } from '../src/category/category.service';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';
import { FileService } from '../src/file/file.service';
import {
  userData,
  loginData,
  createProductsDto,
} from './helpers/productHelper';
import { readFileSync } from 'fs';
import { NOT_FOUND_CATEGORY } from '../src/product/prdouct.constants';
import { UNAUTHORIZED } from '../src/user/user.constants';

describe('ProductsController (E2E)', () => {
  let app: INestApplication;
  let productService: ProductService;
  let userService: UserService;
  let categoryService: CategoryService;
  let authService: AuthService;
  let fileService: FileService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productService = moduleFixture.get<ProductService>(ProductService);
    categoryService = moduleFixture.get<CategoryService>(CategoryService);
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    fileService = moduleFixture.get<FileService>(FileService);
    await app.init();
    await categoryService.deleteAll();
    await productService.deleteAll();
    await userService.deleteAll();
    await fileService.deleteAll();
  });

  afterEach(async () => {
    await categoryService.deleteAll();
    await productService.deleteAll();
    await userService.deleteAll();
    await fileService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  const createCategory = async (adminToken: string): Promise<string> => {
    const createCategoryDto = {
      name: 'Category',
    };

    const response = await request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCategoryDto);

    return response.body._id;
  };

  const uploadFile = async (adminToken: string): Promise<string> => {
    const fileBuffer = readFileSync('uploads/1910e109e146.png');

    const response = await request(app.getHttpServer())
      .post('/file')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fileBuffer, { filename: '1910e109e146.png' });

    return response.body._id;
  };
  describe('When creating a new product with admin role ', () => {
    it('should be success', async () => {
      userData.role = 'admin';
      await userService.createUser(userData);

      const adminToken = await authService.login(loginData);
      const categoryId = await createCategory(adminToken.accessToken);
      const fileId = await uploadFile(adminToken.accessToken);

      createProductsDto.category = categoryId;
      createProductsDto.image = fileId;

      const ProductResponse = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send(createProductsDto)
        .expect(HttpStatus.CREATED);

      expect(ProductResponse.body).toBeDefined();
      expect(ProductResponse.body.name).toBe(createProductsDto.name);
      expect(ProductResponse.body.description).toBe(
        createProductsDto.description,
      );
      expect(ProductResponse.body.price).toBe(createProductsDto.price);
      expect(ProductResponse.body.image._id).toBe(createProductsDto.image);
      expect(ProductResponse.body.category._id).toBe(
        createProductsDto.category,
      );
    });
  });

  describe('When creating a new product without an admin role', () => {
    it('should be error', async () => {
      userData.role = 'admin';
      await userService.createUser(userData);

      const adminToken = await authService.login(loginData);
      const categoryId = await createCategory(adminToken.accessToken);
      const fileId = await uploadFile(adminToken.accessToken);

      createProductsDto.category = categoryId;
      createProductsDto.image = fileId;

      userData.role = 'user';
      userData.email = 'productTest2@mail.ru';
      loginData.email = 'productTest2@mail.ru';

      await userService.createUser(userData);
      const userToken = await authService.login(loginData);

      const ProductResponse = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${userToken.accessToken}`)
        .send(createProductsDto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(ProductResponse.body.message).toBe(UNAUTHORIZED);
    });
  });

  describe('When creating a new product with admin role, but category not found ', () => {
    it('should be error', async () => {
      userData.role = 'admin';
      await userService.createUser(userData);

      const adminToken = await authService.login(loginData);
      const fileId = await uploadFile(adminToken.accessToken);

      createProductsDto.image = fileId;

      const ProductResponse = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${adminToken.accessToken}`)
        .send(createProductsDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(ProductResponse.body.message).toBe(NOT_FOUND_CATEGORY);
    });
  });
});
