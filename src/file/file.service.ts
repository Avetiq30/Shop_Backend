import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { FileModel } from './file.model';
import { FILE_NOT_FOUND } from './file.constants';

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

  getFileById(id: string) {
    return this.fileModel.findById(id);
  }

  getFileList() {
    return this.fileModel.find();
  }

  deleteFileById(id: string) {
    const deletedFile = this.fileModel.findByIdAndDelete(id);
    if (!deletedFile) {
      throw new Error(FILE_NOT_FOUND);
    }
    return deletedFile;
  }
}
