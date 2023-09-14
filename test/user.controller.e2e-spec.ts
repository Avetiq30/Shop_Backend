import { Test, TestingModule} from "@nestjs/testing"
import { HttpStatus, INestApplication} from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { UserService } from "../src/user/user.service"
import { UserModel } from "../src/user/user.model"
import * as bcrypt from 'bcrypt'


describe('UserController', ()=>{
    let app: INestApplication
    let userService: UserService

    afterAll(async()=>{
        await userService.deleteAll()
    })
    
    beforeAll(async ()=>{
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports:[AppModule],
        }).compile()
        
        app = moduleFixture.createNestApplication();
        userService = moduleFixture.get<UserService>(UserService);
        await app.init()
    })
    afterAll(async () => {
        await app.close();
      })
    
describe('When registering a user',()=>{
    it('should register a user success',async ()=>{

        const loginData = {
            email: "testing@mail.ru",
            password: "test123"
        }
       const userData: UserModel  =  {
           name:'test',
           lastname:"lasttest",
           email:loginData.email,
           password:loginData.password,
       }
       const hashedPassword = await bcrypt.hash(userData.password, 10);
       const user: UserModel = {
         ...userData,
         password: hashedPassword, 
       };
       
       const response = await request(app.getHttpServer())
       .post('/user/register')
       .send(userData)
       expect(HttpStatus.OK)
       
       const isPasswordMatch = await bcrypt.compare(userData.password, response.body.password);
      expect(isPasswordMatch).toBe(true)
      expect(response.body.name).toBe(user.name)
      expect(response.body.lastname).toBe(user.lastname)
      expect(response.body.email).toBe(user.email)
      
    })
})
})