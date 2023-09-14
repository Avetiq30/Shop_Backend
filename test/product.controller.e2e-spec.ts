import { Test, TestingModule} from "@nestjs/testing"
import { HttpStatus, INestApplication} from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import {ProductsService} from '../src/products/products.service'
import { CreateProductDto, UpdateProductDto } from "src/products/dto/product.dto"





describe('ProductsController',()=>{
    let app:INestApplication
    let productService:ProductsService

    
    beforeEach(async()=>{
        await productService.deleteAll()
    })

    afterAll(async()=>{
        await productService.deleteAll()
    })

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile()
    
        app = moduleFixture.createNestApplication();
        productService = moduleFixture.get<ProductsService>(ProductsService);
        await app.init();
      })
      afterAll(async()=>{
        await app.close()
      })
 
      describe('Created product', ()=>{
        it('should be access',async()=>{
          
            const  createProduct:CreateProductDto = {
                name:"testProduct",
                description:"test product",
                price:555,
                categoryId:'65003f18dddfccf4b0b23052'
            }
            const response = await request(app.getHttpServer())
            .post('/products/create')
            .send(createProduct)
            expect(HttpStatus.OK) 
            
            expect(response.body.name).toBe(createProduct.name)
            expect(response.body.description).toBe(createProduct.description)
            expect(response.body.price).toBe(createProduct.price)
            expect(response.body.category._id).toBe(createProduct.categoryId)

           
        })
      })

      describe('Update a product', ()=>{
        it('should be access',async()=>{
            const  createProductDto:CreateProductDto = {
                name:"testProduct",
                description:"test product",
                price:555,
                categoryId:'65003f18dddfccf4b0b23052'
            }

            const createdProduct = await productService.createProduct(createProductDto)
           

            const updateProductDto:UpdateProductDto = {
                name:'updateTest',
                price:299
            }
            
            const response = await request(app.getHttpServer())
            .put(`/products/${createdProduct.id}`)
            .send(updateProductDto)
            .expect(HttpStatus.OK)

            expect(response.body).toMatchObject(updateProductDto)

            const updatedProduct = await productService.getProductById(createdProduct.id)
           
            
            expect(updatedProduct.name).toBe(updateProductDto.name)
            expect(updatedProduct.price).toBe(updateProductDto.price)
        })
      })
})