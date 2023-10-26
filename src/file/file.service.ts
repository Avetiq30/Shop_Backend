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

  async uploadFile(file: Express.Multer.File) {
    const newFile = new this.fileModel(file);
    return newFile.save();
  }

  async getFileById(id: string) {
    return await this.fileModel.findById(id);
  }

  async getFileList() {
    return await this.fileModel.find();
  }

  async deleteFileById(id: string) {
    const deletedFile = await this.fileModel.findByIdAndDelete(id);
    if (!deletedFile) {
      throw new Error(FILE_NOT_FOUND);
    }
    return deletedFile;
  }
}
