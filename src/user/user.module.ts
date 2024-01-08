import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { BcryptService } from '../auth/bcrypt.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
          timestamps: true,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService, UserModel],
  exports: [UserService],
})
export class UserModule {}
