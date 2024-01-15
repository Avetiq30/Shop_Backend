import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../configs/multer.config';
import { FileModel } from './file.model';
import { FILE_NOT_FOUND } from './file.constants';
import { JwtAuthGuard } from '../Jwt/jwt-auth.guard';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(new JwtAuthGuard(['admin']))
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  @UseGuards(new JwtAuthGuard(['admin']))
  async getFileById(@Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    if (!file) {
      throw new Error(FILE_NOT_FOUND);
    }
    return file;
  }

  @Get()
  @UseGuards(new JwtAuthGuard(['admin']))
  async getFileList(): Promise<FileModel[]> {
    return await this.fileService.getFileList();
  }

  @Delete(':id')
  async deleteFileById(@Param('id') id: string) {
    const deletedFile = await this.fileService.deleteFileById(id);
    return deletedFile;
  }
}
