import { prop } from '@typegoose/typegoose';
import { Readable } from 'stream';
import { Express } from 'express';

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

  @prop()
  public stream: Readable;

  @prop({ required: true })
  public destination: string;

  @prop({ required: true })
  public filename: string;

  @prop({ required: true })
  public path: string;

  @prop()
  public buffer: Buffer;
}
