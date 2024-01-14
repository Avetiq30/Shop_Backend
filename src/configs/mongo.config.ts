import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { NestConfigService } from './config.service';

export const getMongoConfig = async (
  nestConfigService: NestConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: nestConfigService.getMongoString,
    ...getMongoOptions(),
  };
};

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
