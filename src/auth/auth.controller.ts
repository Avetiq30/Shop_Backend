import { Body, Controller, Get, Post, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

   
    @Post('login')
    async login(@Request()req){
        return this.authService.login(req.user)
    }
    @Post('register')
    async register(@Request()req,@Body() createUserDto:CreateUserDto){
        return this.authService.register(createUserDto)
    }

    @Get('profile')
    getProfile(@Request()req){}
    
}
