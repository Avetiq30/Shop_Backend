import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { FileService } from './file.service';
import { FileModel } from './file.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FileModel,
        schemaOptions: {
          collection: 'files',
        },
      },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
