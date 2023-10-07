import { prop } from '@typegoose/typegoose';
import { Readable } from 'stream';
import { Express } from 'Express';

export class FileModel implements Express.Multer.File {
  @prop({ required: true })
  public fieldname: string;

  @prop({ required: true })
  public originalname: string;

  @prop({ required: true })
  public encoding: string;

  @prop({ required: true })
  public mimetype: string;

  @prop({ required: true })
  public size: number;

  @prop({ required: true })
  public stream: Readable;

  @prop({ required: true })
  public destination: string;

  @prop({ required: true })
  public filename: string;

  @prop({ required: true })
  public path: string;

  @prop({ required: true })
  public buffer: Buffer;

  @prop({ default: Date.now })
  public createdAt: Date;

  @prop({ default: Date.now })
  public updatedAt: Date;
}
