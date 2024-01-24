import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { FileModel } from './file.model';
import {
  FILE_NOT_FOUND,
  FILE_NOT_PROVIDED,
  INVALID_FILE_FORMAT,
} from './file.constants';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileModel: ReturnModelType<typeof FileModel>,
  ) {}

  isValidFileFormat(originalname: string): boolean {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'webp'];
    const fileExtension = this.getFileExtension(originalname);
    return allowedFormats.includes(fileExtension);
  }

  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  async uploadFile(file) {
    const files = new this.fileModel(file);
    if (!files) {
      throw new HttpException(FILE_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }
    const isValidFormat = this.isValidFileFormat(file.originalname);
    if (!isValidFormat) {
      throw new HttpException(INVALID_FILE_FORMAT, HttpStatus.BAD_REQUEST);
    }

    return files.save();
  }

  async getFileById(id: string) {
    return this.fileModel.findById(id);
  }

  async getFileList() {
    return this.fileModel.find();
  }

  async deleteFileById(id: string) {
    const file = this.fileModel.findByIdAndDelete(id);
    if (!file) {
      throw new HttpException(FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async deleteAll() {
    return this.fileModel.deleteMany();
  }
}
