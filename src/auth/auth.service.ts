import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/user.dto';
import { User } from '../user/user.model/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtservice:JwtService
        ){}

        async validateUser(createUserDto:CreateUserDto):Promise<User|null>{
            const user =  await this.userService.createUser(createUserDto)
            if(user && user.password){
                return user
            }
            return null
        }
        async login(user:User){
            const payload = {sub: user.email}
            return {
                access_token: this.jwtservice.sign(payload)
            }
        }

        async register(createUserDto:CreateUserDto){
            const existingUser = await this.userService.createUser(createUserDto)
            if(existingUser){
                throw new UnauthorizedException(ALREADY_REGISTERED_ERROR)
            }
            const newUser = await this.userService.createUser(createUserDto)
            return newUser
        }
}
