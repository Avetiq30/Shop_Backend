import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../configs/multer.config';
import { FileModel } from './file.model';
import { FILE_NOT_FOUND } from './file.constants';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  async getFileById(@Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    if (!file) {
      throw new Error(FILE_NOT_FOUND);
    }
    return file;
  }

  @Get()
  async getFileList(): Promise<FileModel[]> {
    return await this.fileService.getFileList();
  }

  @Delete(':id')
  async deleteFileById(@Param('id') id: string) {
    const deletedFile = await this.fileService.deleteFileById(id);
    return deletedFile;
  }
}
