import { Controller, Post, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('backstage/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传图片
   * POST /api/backstage/upload/image
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file)
  }

  /**
   * 删除图片
   * DELETE /api/backstage/upload/image/:filename
   */
  @Delete('image/:filename')
  async deleteImage(@Param('filename') filename: string) {
    return this.uploadService.deleteImage(filename)
  }
}
