import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductService } from '../src/product/product.service';
import { createProducts, updateProducts } from './helpers/productHelper';
import { CategoryService } from '../src/category/category.service';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';

describe('ProductsController (E2E)', () => {
  let app: INestApplication;
  let productService: ProductService;
  let userService: UserService;
  let categoryService: CategoryService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productService = moduleFixture.get<ProductService>(ProductService);
    categoryService = moduleFixture.get<CategoryService>(CategoryService);
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
    await categoryService.deleteAll();
    await productService.deleteAll();
    await userService.deleteAll();
  });

  afterEach(async () => {
    await categoryService.deleteAll();
    await productService.deleteAll();
    await userService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  async function userAndAuthFunction() {
    const userData = {
      name: 'test',
      lastname: 'tests',
      email: 'tests@mail.ru',
      password: '00000',
    };
    const createUser = await userService.createUser(userData);
    return authService.login({
      email: userData.email,
      password: userData.password,
    });
  }

  async function categoryFanction() {
    const categoryData = { name: 'test' };
    const category = await categoryService.createCategory(categoryData);
    return category._id;
  }

  describe('When trying to create a product', () => {
    let token;
    let category;
    beforeAll(async () => {
      token = await userAndAuthFunction();
      category = await categoryFanction();
    });
    it('should be success', async () => {
      const createProductsCategoryId = {
        ...createProducts,
        categoryId: category._id,
      };
      const response = await request(app.getHttpServer())
        .post('/product')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductsCategoryId);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.name).toBe(createProductsCategoryId.name);
      expect(response.body.description).toBe(
        createProductsCategoryId.description,
      );
      expect(response.body.price).toBe(createProductsCategoryId.price);
      expect(response.body.categoryId).toBe(category._id.toString());
      expect(response.body.image).toBe(createProductsCategoryId.image);
    });
  });

  describe('When trying to get a product by ID', () => {
    let token;
    let category;
    beforeAll(async () => {
      token = await userAndAuthFunction();
      category = await categoryFanction();
    });
    it('should return a product', async () => {
      const createProductsCategoryId = {
        ...createProducts,
        categoryId: category._id,
      };
      const createdProduct = await productService.createProduct(
        createProductsCategoryId,
      );

      const response = await request(app.getHttpServer())
        .get(`/product/${createdProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.name).toBe(createProductsCategoryId.name);
      expect(response.body.description).toBe(
        createProductsCategoryId.description,
      );
      expect(response.body.price).toBe(createProductsCategoryId.price);
      expect(response.body.categoryId).toBe(category._id.toString());
      expect(response.body.image).toBe(createProductsCategoryId.image);
    });
  });

  describe('When return all products', () => {
    it('should be success', async () => {
      const response = await request(app.getHttpServer()).get('/product');
      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('When filter products by minimum price', () => {
    it('should be success', async () => {
      const minPrice = 10;
      const response = await request(app.getHttpServer())
        .get(`/product`)
        .query({ minPrice });
      expect(response.status).toBe(HttpStatus.OK);
      const products = response.body as any;
      expect(products.every((product) => product.price >= minPrice)).toBe(true);
    });
  });

  describe('When filter products by maximum price', () => {
    it('should be success', async () => {
      const maxPrice = 100;
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ maxPrice });
      expect(response.status).toBe(HttpStatus.OK);
      const products = response.body as any;
      expect(products.every((product) => product.price <= maxPrice)).toBe(true);
    });
  });

  describe('When filter products by category', () => {
    it('should be success', async () => {
      const categoryId = '650198bafe882cd6b77ce7e5';
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ categoryId: categoryId });

      expect(response.status).toBe(HttpStatus.OK);
      const products = response.body as any;
      expect(products.every((product) => product.category === categoryId)).toBe(
        true,
      );
    });
  });

  describe('When filter products by minimum and maximum price', () => {
    it('should be success', async () => {
      const minPrice = 10;
      const maxPrice = 100;
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ minPrice, maxPrice });

      expect(response.status).toBe(HttpStatus.OK);
      const products = response.body as any;
      expect(
        products.every(
          (product) => product.price >= minPrice && product.price <= maxPrice,
        ),
      ).toBe(true);
    });
  });

  describe('When filter products by category, minimum and maximum price', () => {
    it('should be success', async () => {
      const categoryId = '650198bafe882cd6b77ce7e5'; //
      const minPrice = 10;
      const maxPrice = 100;
      const response = await request(app.getHttpServer())
        .get('/product')
        .query({ minPrice, maxPrice, categoryId });
      expect(response.status).toBe(HttpStatus.OK);
      const products = response.body as any;
      expect(Array.isArray(products)).toBe(true);
      expect(
        products.every(
          (product) =>
            product.category._id === categoryId &&
            product.price >= minPrice &&
            product.price <= maxPrice,
        ),
      ).toBe(true);
    });
  });

  describe('When updated product by id and product already exist', () => {
    let token;
    let category;
    beforeAll(async () => {
      token = await userAndAuthFunction();
      category = await categoryFanction();
    });
    it('should be success', async () => {
      const createProductsCategoryId = {
        ...createProducts,
        categoryId: category._id,
      };
      const create = await productService.createProduct(
        createProductsCategoryId,
      );
      create.price = 90;

      const response = await request(app.getHttpServer())
        .put(`/product/${create._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(create)
        .expect(HttpStatus.OK);
    });
  });
});
