import { Body, Controller, Get, Param, Post ,Put, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './user.model/user.model';

@Controller('user')
export class UserController {
     constructor(private readonly userService:UserService){}

     @Post('create')
     async craeteUser(@Body()createUserDto:CreateUserDto):Promise<User>{
        return this.userService.createUser(createUserDto)
     }

     @Get()
     async getAllUsers():Promise<User[]>{
        return this.userService.getAllUsers()
     }
     @Get(':id')
     async getUserById(@Param('id')id:string):Promise<User>{
        return this.userService.getUserById(id)
     }
     @Put(':id')
     async updateUser(@Param('id')id:string, @Body() updateUserDto:CreateUserDto):Promise<User>{
        return this.userService.updateUser(id,updateUserDto)
     }

     @Delete(':id')
     async deleteUser(@Param('id')id:string):Promise<void>{
        return this.userService.deleteUser(id)
     }

}
