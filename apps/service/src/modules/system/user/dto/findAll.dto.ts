import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { ApiModel } from '@/common/decorators/swagger.decorator'

@ApiModel({
  page: { type: Number, description: '第几页', required: false },
  limit: { type: Number, description: '一页几条数据', required: false },
})
export class FindAllDTO {
  @Min(1, { message: 'page至少为1' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  page?: number

  @Max(100, { message: 'limit最多为100' })
  @Min(1, { message: 'limit至少为1' })
  @IsNumber({}, { message: '请输入正确的数字格式' })
  @Type(() => Number)
  @IsOptional()
  limit?: number
}
