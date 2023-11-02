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

  async uploadFile(file) {
    const newFile = new this.fileModel(file);
    return newFile.save();
  }

  async getFileById(id: string) {
    return this.fileModel.findById(id);
  }

  async getFileList() {
    return this.fileModel.find();
  }

  async deleteFileById(id: string) {
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
