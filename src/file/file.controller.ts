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
    return this.fileService.getFileById(id);
  }

  @Get()
  getFileList() {
    return this.fileService.getFileList();
  }

  @Delete(':id')
  deleteFileById() {
    return this.fileService.deleteFileById();
  }
}
