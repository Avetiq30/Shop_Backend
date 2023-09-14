import { Test, TestingModule} from "@nestjs/testing"
import { HttpStatus, INestApplication} from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { UserService } from "../src/user/user.service"
import { UserModel } from "../src/user/user.model"


describe('AuthController (e2e)',()=>{
    let app :INestApplication
    let userService: UserService

    beforeEach(async()=>{
        await userService.deleteAll()
    })
    afterAll(async()=>{
        await userService.deleteAll()
    })

    beforeAll(async ()=>{
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports:[AppModule],
        }).compile()

        app =  moduleFixture.createNestApplication()
        userService = moduleFixture.get<UserService>(UserService)
        await app.init()
    })
    afterAll(async ()=>{
        await app.close()
    })

    describe('When trying login',()=>{
     it('should be success',async()=>{
      
         const loginData = {
             email: "test@mail.ru",
             password: "test123"
         }
        const user: UserModel  =  {
            name:'test',
            lastname:"lasttest",
            email:loginData.email,
            password:loginData.password,
        }

       await userService.createUser(user)

        const response =  await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(HttpStatus.OK)
        expect(response.body.token).toBeDefined()
       

      })
    })
   
})