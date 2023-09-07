import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.model/product.model';


@Module({
    imports:[TypegooseModule.forFeature([Product])],
    providers:[ProductsService],
    controllers:[ProductsController],
    exports:[ProductsService]
})
export class ProductsModule {}
