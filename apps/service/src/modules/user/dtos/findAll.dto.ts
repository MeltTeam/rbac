import { IsNumberString, IsOptional } from 'class-validator'

export class FindAllDto {
  @IsNumberString({}, { message: '请输入正确的数字格式' })
  @IsOptional()
  page?: number

  @IsNumberString({}, { message: '请输入正确的数字格式' })
  @IsOptional()
  limit?: number
}
