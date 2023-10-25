import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/product/products.service';
import { UpdateProductDto } from '../src/product/dto/product.dto';
import { createProductDto } from './helpers/productHelper';

describe('ProductsController', () => {
  let app: INestApplication;
  let productService: ProductsService;

  beforeEach(async () => {
    await productService.deleteAll();
  });

  afterAll(async () => {
    await productService.deleteAll();
    await app.close();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productService = moduleFixture.get<ProductsService>(ProductsService);
    await app.init();
  });

  describe('When trying to create product', () => {
    it('should be access', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto);
      expect(HttpStatus.OK);

      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.description).toBe(createProductDto.description);
      expect(response.body.price).toBe(createProductDto.price);
      expect(response.body.category._id).toBe(createProductDto.categoryId);
    });
  });

  describe('When trying update a product', () => {
    it('should be access', async () => {
      const createdProduct =
        await productService.createProduct(createProductDto);
      const updateProductDto: UpdateProductDto = {
        name: 'updateTest',
        price: 299,
      };

      const response = await request(app.getHttpServer())
        .put(`/products/${createdProduct.id}`)
        .send(updateProductDto)
        .expect(HttpStatus.OK);

      expect(response.body._id).toBe(createdProduct.id);
      expect(response.body.name).toBe(updateProductDto.name);
      expect(response.body.price).toBe(updateProductDto.price);
      expect(response.body.categoryId).toBe(createdProduct.categoryId);
      expect(response.body.description).toBe(createdProduct.description);
    });
  });

  describe('When trying product by id and product is not exist', () => {
    it('should be error', async () => {
      const invalidId = 'invalidId';

      const response = await request(app.getHttpServer())
        .get(`/products/${invalidId}`)
        .send(createProductDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Could not found product by id');
    });
  });
});
