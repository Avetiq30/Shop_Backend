import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model/user.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly userModel: Model<User>){}

    async createUser(createUserDto: CreateUserDto):Promise<User>{
        const newUser = new this.userModel(createUserDto)
        return await newUser.save()
    }
    async getAllUsers(): Promise<User[]>{
        return await this.userModel.find().exec()
    }
    async getUserById(id:string):Promise<User>{
        const user = await this.userModel.findById(id).exec()
        if(!user){
            throw new NotFoundException(USER_NOT_FOUND)
        }
        return user
    }
    async updateUser(id:string,updateUserDto:CreateUserDto):Promise<User>{
        const updatedUser = await this.userModel
            .findOneAndUpdate({ _id: id }, updateUserDto, { new: true })
            .exec();
    
        if (!updatedUser) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
    
        return updatedUser
    }

    async deleteUser(id:string ):Promise<void>{
        await this.userModel.findByIdAndRemove(id).exec();
    }
}
