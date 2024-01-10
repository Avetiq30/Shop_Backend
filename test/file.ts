// import { Test, TestingModule } from '@nestjs/testing';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { FileService } from '../src/file/file.service';
// import { AppModule } from '../src/app.module';

// describe('FileController (E2E)', () => {
//   let app: INestApplication;
//   let fileService: FileService;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     fileService = moduleFixture.get<FileService>(FileService);
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   describe('When trying to create a file', () => {
//     it('should be success', async () => {
//       const fileData = {
//         fieldname: 'file',
//         originalname: 'macbook.webp',
//         encoding: '7bit',
//         mimetype: 'image/webp',
//         size: 23034,
//         destination: './uploads/',
//         filename: '4a62dd4366.webp',
//         path: 'uploads/4a62dd4366.webp',
//       };
//       const response = await request(app.getHttpServer())
//         .post('/file')
//         .attach('file', 'uploads/4a62dd4366.webp');

//       expect(response.status).toBe(HttpStatus.CREATED);
//       expect(response.body).toHaveProperty('_id');

//       const uploadedFileId = response.body._id;
//       const uploadedFile = await fileService.getFileById(uploadedFileId);
//       expect(uploadedFile.fieldname).toBe(fileData.fieldname);
//       expect(uploadedFile.size).toBe(fileData.size);
//     });
//   });

//   describe('When trying to get a file by ID', () => {
//     async function imageIdFunction() {
//       const fileData = {
//         fieldname: 'file',
//         originalname: 'macbook.webp',
//         encoding: '7bit',
//         mimetype: 'image/webp',
//         size: 23034,
//         destination: './uploads/',
//         filename: '4a62dd4366.webp',
//         path: 'uploads/4a62dd4366.webp',
//       };
//       const getFile = await fileService.uploadFile(fileData);
//       return getFile._id.toString();
//     }
//     let imageId;
//     it('should return a file', async () => {
//       imageId = await imageIdFunction();
//       expect(imageId).toBeDefined();

//       const response = await request(app.getHttpServer()).get(
//         `/file/${imageId}`,
//       );

//       expect(response.status).toBe(HttpStatus.OK);
//       expect(response.body.fieldname).toBe('file');
//     });
//   });
// });
