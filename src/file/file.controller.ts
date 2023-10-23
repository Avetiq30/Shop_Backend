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

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  getFileById(@Param('id') id: string) {
    const file = this.fileService.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  @Get()
  async getFileList(): Promise<FileModel[]> {
    return  await this.fileService.getFileList();
   
  }

  @Delete(':id')
  deleteFileById(@Param('id') id: string) {
      const deletedFile = this.fileService.deleteFileById(id);
      return deletedFile;
    }
  }

