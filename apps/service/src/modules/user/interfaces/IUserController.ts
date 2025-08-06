import type { AddDto, DelDto, PatchDto, PatchIdDto } from '../dtos'
import type { UserVo } from '../vos'

export type DelUserOK = '删除用户成功'
export type PatchUserOK = '修改用户成功'
export class IUserController {
  /**
   * 添加用户接口
   * @param addDto 添加用户参数
   */
  add: (addDto: AddDto) => Promise<UserVo>

  /**
   * 删除用户接口
   * @param delDto 删除用户参数
   */
  del: (delDto: DelDto) => Promise<DelUserOK>

  /**
   * 修改用户接口
   * @param patchIdDto 修改用户参数(id)
   * @param patchDto 修改用户参数
   */
  patch: (patchIdDto: PatchIdDto, patchUserDto: PatchDto) => Promise<PatchUserOK>
}
