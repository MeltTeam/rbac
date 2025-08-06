import type { UpdateResult } from 'typeorm'
import type { DelDto, PatchDto, PatchIdDto } from '../dtos'
import type { UserVo } from '../vos'

export interface AddOptions {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
}
export interface IUserService {
  /**
   * 添加用户
   * @param addOptions 添加用户参数
   * @param errorMsg 错误信息
   * @param by 操作者，默认sys
   */
  add: (addOptions: AddOptions, errorMsg: string, by: string) => Promise<UserVo>
  /**
   * 删除用户
   * @param delDto 删除用户参数
   * @param errorMsg 错误信息
   * @param by 操作者，默认sys
   */
  del: (delDto: DelDto, errorMsg: string, by: string) => Promise<boolean>
  /**
   * 更新用户
   * @param patchIdDto 更新用户参数(ID)
   * @param patchDto 更新用户参数
   * @param errorMsg 错误信息
   * @param by 操作者，默认sys
   */
  patch: (patchIdDto: PatchIdDto, patchDto: PatchDto, errorMsg?: string, by?: string) => Promise<UpdateResult>
}
