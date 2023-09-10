import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypegooseModule } from 'nestjs-typegoose';
import {UserModel}from '../user/user.model'



@Module({
  imports: [
     TypegooseModule.forFeature([
      {
        typegooseClass:UserModel,
        schemaOptions:{
          collection:'User'
        }
      }
     ]), 
  ],
  controllers: [UserController],
  providers: [UserService,UserModel],
  exports :[UserService]

})
export class UserModule {}


