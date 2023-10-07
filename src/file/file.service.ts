import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { FileModel } from './file.model';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileModel: ReturnModelType<typeof FileModel>,
  ) {}

  uploadFile(file: Express.Multer.File) {
    const newFile = new this.fileModel(file);
    return newFile.save();
  }

  getFileById(id) {
    return this.fileModel.findById(id);
  }

  getFileList() {}

  deleteFileById() {
    // check if file used in products
    // delete file from mongodb
    // delete file from upload dir
  }
}
