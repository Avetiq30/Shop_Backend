import { ConfigService } from "@nestjs/config";
import { log } from "console";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export const getMongoConfig = async (configService:ConfigService):Promise<TypegooseModuleOptions> =>{
return {
    uri: getMongoString(configService),
    ...getMongoOptions( )
}

}

const getMongoString=(configService:ConfigService)=>{
    
return configService.get('MONGODB_URI')
}

const getMongoOptions = ()=>
   ({ 
    useNewUrlParser:true,
    useUnifiedTopology: true
    })
