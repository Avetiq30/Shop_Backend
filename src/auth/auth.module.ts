import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/Jwt/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


@Module({
    imports:[
        PassportModule,
        JwtModule.register({
            secret: 'JWT_SECRET',
            signOptions: {expiresIn:'1h'}
        })
    ],
    providers:[AuthService,JwtStrategy],
    controllers:[AuthController],
    exports:[JwtModule]
})
export class AuthModule {}
