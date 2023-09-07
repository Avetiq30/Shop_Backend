import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"; 
import {ExtractJwt,Strategy} from 'passport-jwt'
import { ConfigService} from '@nestjs/config'
import {AuthService} from '../auth/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
            ){
                super({
                    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: configService.get('JWT_SECRET')
                })
            }
            async validate(payload:any){
                return await this.authService.validateUser(payload.sub)
            }
}