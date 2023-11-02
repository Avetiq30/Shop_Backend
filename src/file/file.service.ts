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

  uploadFile(file) {
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
    // check if file used in products
    // delete file from mongodb
    // delete file from upload dir
    const deletedFile = this.fileModel.findByIdAndDelete(id);
    if (!deletedFile) {
      throw new Error('File not found');
    }
    return deletedFile;
  }
}
