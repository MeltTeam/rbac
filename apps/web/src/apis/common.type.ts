export interface AuthDetailsVO {
  /** 认证名 */
  name: string
  /** 认证ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface CreateAuthDTO {
  /** 认证名 */
  name: string
  /** 备注 */
  remark?: string
}

export interface CreateMenuDTO {
  /** 父节点ID */
  parentId?: string
  /** 菜单名 */
  name: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: 10 | 20 | 30 | 40 | 50 | 60
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,LINK,INNER_LINK) */
  path: string
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias?: string
  /** 组件路径 */
  component: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect?: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  query?: string
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache?: 10 | 20
  /** 是否隐藏(MENU) */
  isVisible?: 10 | 20
  /** 是否刷新(MENU) */
  isRefresh?: 10 | 20
  /** 备注 */
  remark?: string
}

export interface CreateResourceDTO {
  /** 资源名 */
  name: string
  /** 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50) */
  resourceType: 10 | 20 | 30 | 40 | 50
  /** 资源领域 */
  domain: string
  /** 资源方法 */
  method: string
  /** 备注 */
  remark?: string
}

export interface CreateRoleDTO {
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope: 10 | 20 | 30 | 40 | 50
  /** 父节点ID */
  parentId?: string
  /** 备注 */
  remark?: string
}

export interface CreateUserDTO {
  /** 用户名 */
  name: string
  /** 邮箱 */
  email?: string
  /** 电话号码 */
  phone?: string
  /** 密码 */
  pwd: string
  /** 备注 */
  remark?: string
}

export interface DeleteAuthParams {
  /** 业务ID */
  id: string
}

export interface DeleteMenuParams {
  /** 业务ID */
  id: string
}

export interface DeleteResourceParams {
  /** 业务ID */
  id: string
}

export interface DeleteRoleParams {
  /** 业务ID */
  id: string
}

export interface DeleteUserParams {
  /** 业务ID */
  id: string
}

export interface EmailCaptchaDTO {
  /** 邮箱 */
  email: string
}

export interface EmailCaptchaParams {
  /** 验证名 ["test", "register", "login", "resetPwd", "updateInfo"] */
  name: string
}

export interface EmailLoginDTO {
  /** 邮箱 */
  email: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
}

export interface EmailRegisterDTO {
  /** 用户名 */
  name: string
  /** 邮箱 */
  email: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
}

export interface EmailResetPwdDTO {
  /** 邮箱 */
  email: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
  /** 确认密码 */
  confirmPwd: string
}

export interface FindAllAuthVO {
  /** 认证详情列表 */
  data: AuthDetailsVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

export interface FindAllMenuVO {
  /** 菜单详情列表 */
  data: MenuDetailsVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

export interface FindAllResourceVO {
  /** 资源详情列表 */
  data: ResourceDetailsVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

export interface FindAllRoleVO {
  /** 角色详情列表 */
  data: RoleDetailsVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

export interface FindAllUserVO {
  /** 用户详情列表 */
  data: UserDetailsVO[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

export interface GetAuthByIdParams {
  /** 业务ID */
  id: string
}

export interface GetAuthsParams {
  /** 第几页 */
  page?: number
  /** 一页几条数据 */
  limit?: number
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name) */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  /** 排序方式(升序:asc 降序:desc) */
  orderType?: 'asc' | 'desc'
}

export interface GetMenuByIdParams {
  /** 业务ID */
  id: string
}

export interface GetMenuByRoleParams {
  /** 业务ID */
  id: string
}

export interface GetMenusParams {
  /** 第几页 */
  page?: number
  /** 一页几条数据 */
  limit?: number
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name) */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  /** 排序方式(升序:asc 降序:desc) */
  orderType?: 'asc' | 'desc'
}

export interface GetMenuTreeParams {
  /** 业务ID */
  id: string
  /** 树深度,-1是深度无限制 */
  depth?: number
}

export interface GetResourceByIdParams {
  /** 业务ID */
  id: string
}

export interface GetResourceByRoleParams {
  /** 业务ID */
  id: string
}

export interface GetResourcesParams {
  /** 第几页 */
  page?: number
  /** 一页几条数据 */
  limit?: number
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name) */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  /** 排序方式(升序:asc 降序:desc) */
  orderType?: 'asc' | 'desc'
}

export interface GetRoleByIdParams {
  /** 业务ID */
  id: string
}

export interface GetRoleByMenuParams {
  /** 业务ID */
  id: string
}

export interface GetRoleByResourceParams {
  /** 业务ID */
  id: string
}

export interface GetRoleByUserParams {
  /** 业务ID */
  id: string
}

export interface GetRolesParams {
  /** 第几页 */
  page?: number
  /** 一页几条数据 */
  limit?: number
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name) */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  /** 排序方式(升序:asc 降序:desc) */
  orderType?: 'asc' | 'desc'
}

export interface GetRoleTreeParams {
  /** 业务ID */
  id: string
  /** 树深度,-1是深度无限制 */
  depth?: number
}

export interface GetTreesDTO {
  /** 树深度,-1是深度无限制 */
  depth?: number
  /** 业务ID列表 */
  ids: string[]
}

export interface GetUserByIdParams {
  /** 业务ID */
  id: string
}

export interface GetUserByRoleParams {
  /** 业务ID */
  id: string
}

export interface GetUsersParams {
  /** 第几页 */
  page?: number
  /** 一页几条数据 */
  limit?: number
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段(创建时间:createdAt 更新时间:updatedAt 名称:name) */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  /** 排序方式(升序:asc 降序:desc) */
  orderType?: 'asc' | 'desc'
}

export interface MeInfoVO {
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: UserProfileVO
  /** 用户ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
  /** 角色编码 */
  roles: string[]
  /** 菜单编码 */
  menus: string[]
  /** 菜单路由 */
  routes: MenuRouteVO[]
  /** 按钮编码 */
  btns: string[]
  /** 组件编码 */
  comps: string[]
}

export interface MenuDetailsVO {
  /** 父菜单ID */
  parentId: string
  /** 菜单ID */
  id: string
  /** 菜单名 */
  name: string
  /** 菜单编码(菜单类型:领域:操作类型) */
  menuCode: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: 10 | 20 | 30 | 40 | 50 | 60
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,DIRECTORY,LINK,INNER_LINK) */
  path: string
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias: string
  /** 组件路径 */
  component: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  query: string
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: 10 | 20
  /** 是否隐藏(MENU) */
  isVisible: 10 | 20
  /** 是否刷新(MENU) */
  isRefresh: 10 | 20
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface MenuIdsVO {
  /** 菜单ID列表 */
  ids: string[]
}

export interface MenuRouteMetaVO {
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: boolean
  /** 是否隐藏(MENU) */
  isVisible: boolean
  /** 是否刷新(MENU) */
  isRefresh: boolean
  /** 菜单编码 */
  code: string
}

export interface MenuRouteVO {
  /** 路由名 */
  name?: string
  /** 路由名 */
  path: string
  /** 路由名 */
  alias?: string
  /** 路由名 */
  component: string
  /** 路由名 */
  redirect?: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  query?: string
  /** 路由元数据 */
  meta: MenuRouteMetaVO
  /** 子路由 */
  children?: MenuRouteVO[]
}

export interface MenuTreeVO {
  /** 父菜单ID */
  parentId: string
  /** 菜单ID */
  id: string
  /** 菜单名 */
  name: string
  /** 菜单编码(菜单类型:领域:操作类型) */
  menuCode: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: 10 | 20 | 30 | 40 | 50 | 60
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,DIRECTORY,LINK,INNER_LINK) */
  path: string
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias: string
  /** 组件路径 */
  component: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  query: string
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: 10 | 20
  /** 是否隐藏(MENU) */
  isVisible: 10 | 20
  /** 是否刷新(MENU) */
  isRefresh: 10 | 20
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
  /** 菜单子节点列表 */
  children: MenuTreeVO[]
}

export interface MoveMenuDTO {
  /** 父节点ID */
  parentId?: string
}

export interface MoveMenuParams {
  /** 业务ID */
  id: string
}

export interface MoveRoleDTO {
  /** 父节点ID */
  parentId?: string
}

export interface MoveRoleParams {
  /** 业务ID */
  id: string
}

export interface RefreshTokenDTO {
  /** 刷新令牌 */
  refreshToken?: string
}

export interface ReplaceRoleMenuDTO {
  /** 业务ID */
  id: string
  /** 菜单ID列表 */
  menuIds: string[]
}

export interface ReplaceRoleResourceDTO {
  /** 业务ID */
  id: string
  /** 资源ID列表 */
  resourceIds: string[]
}

export interface ReplaceRolesMenuDTO {
  /** 菜单ID列表 */
  menuIds: string[]
  /** 业务ID列表 */
  ids: string[]
}

export interface ReplaceRolesResourceDTO {
  /** 资源ID列表 */
  resourceIds: string[]
  /** 业务ID列表 */
  ids: string[]
}

export interface ReplaceUserRoleDTO {
  /** 业务ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

export interface ReplaceUsersRoleDTO {
  /** 角色ID列表 */
  roleIds: string[]
  /** 业务ID列表 */
  ids: string[]
}

export interface ResourceDetailsVO {
  /** 资源名 */
  name: string
  /** 资源编码(资源类型:领域:方法) */
  resourceCode: string
  /** 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50) */
  resourceType: 10 | 20 | 30 | 40 | 50
  /** 领域 */
  domain: string
  /** 方法 */
  method: string
  /** 资源ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface ResourceIdsVO {
  /** 资源ID列表 */
  ids: string[]
}

export interface ResVO {
  /** 业务码 */
  code: string
  /** 业务信息 */
  msg: string
  /** 业务数据(对象或数组) */
  data: Record<string, unknown>
  /** 请求地址 */
  originUrl: string
  /** 请求源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 时间戳 */
  timestamp: number
  /** 客户端IP */
  clientIp: string
}

export interface RoleDetailsVO {
  /** 角色父节点ID */
  parentId: string
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope: 10 | 20 | 30 | 40 | 50
  /** 角色ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface RoleIdsVO {
  /** 角色ID列表 */
  ids: string[]
}

export interface RoleTreeVO {
  /** 角色父节点ID */
  parentId: string
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope: 10 | 20 | 30 | 40 | 50
  /** 角色ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
  /** 角色子节点列表 */
  children: RoleTreeVO[]
}

export interface SvgCaptchaParams {
  /** 验证名 ["test", "register", "login", "resetPwd", "updateInfo"] */
  name: string
}

export interface SvgCaptchaVO {
  /** svg验证码凭证 */
  token: string
  /** svg验证码Base64 */
  svg: string
}

export interface SvgLoginDTO {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd: string
  /** 验证码令牌 */
  token: string
  /** 验证码 */
  captcha: string
}

export interface TokenVO {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken?: string
}

export interface UpdateAuthDTO {
  /** 认证名 */
  name?: string
  /** 备注 */
  remark?: string
}

export interface UpdateAuthParams {
  /** 业务ID */
  id: string
}

export interface UpdateAuthSortParams {
  /** 业务ID */
  id: string
}

export interface UpdateAuthStatusParams {
  /** 业务ID */
  id: string
}

export interface UpdateMenuDTO {
  /** 菜单名 */
  name?: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType?: 10 | 20 | 30 | 40 | 50 | 60
  /** 菜单领域 */
  domain?: string
  /** 菜单操作类型 */
  action?: string
  /** 访问路径(MENU,LINK,INNER_LINK) */
  path?: string
  /** 别名(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  alias?: string
  /** 组件路径 */
  component?: string
  /** 重定向(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  redirect?: string
  /** 路由参数(MENU,DIRECTORY,LINK,INNER_LINK)(JSON) */
  query?: string
  /** 标题(MENU,DIRECTORY,LINK,INNER_LINK) */
  title?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache?: 10 | 20
  /** 是否隐藏(MENU) */
  isVisible?: 10 | 20
  /** 是否刷新(MENU) */
  isRefresh?: 10 | 20
  /** 备注 */
  remark?: string
}

export interface UpdateMenuParams {
  /** 业务ID */
  id: string
}

export interface UpdateMenuSortParams {
  /** 业务ID */
  id: string
}

export interface UpdateMenuStatusParams {
  /** 业务ID */
  id: string
}

export interface UpdateResourceDTO {
  /** 资源名 */
  name?: string
  /** 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50) */
  resourceType?: 10 | 20 | 30 | 40 | 50
  /** 资源领域 */
  domain?: string
  /** 资源方法 */
  method?: string
  /** 备注 */
  remark?: string
}

export interface UpdateResourceParams {
  /** 业务ID */
  id: string
}

export interface UpdateResourceSortParams {
  /** 业务ID */
  id: string
}

export interface UpdateResourceStatusParams {
  /** 业务ID */
  id: string
}

export interface UpdateRoleDTO {
  /** 角色名 */
  name?: string
  /** 角色编码 */
  roleCode?: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope?: 10 | 20 | 30 | 40 | 50
  /** 备注 */
  remark?: string
}

export interface UpdateRoleParams {
  /** 业务ID */
  id: string
}

export interface UpdateRoleSortParams {
  /** 业务ID */
  id: string
}

export interface UpdateRoleStatusParams {
  /** 业务ID */
  id: string
}

export interface UpdateSortDTO {
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface UpdateStatusDTO {
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
}

export interface UpdateUserDTO {
  /** 用户名 */
  name?: string
  /** 昵称 */
  nickName?: string
  /** 性别(未知:10 男:20 女:30) */
  sex?: 10 | 20 | 30
  /** 出生日期 */
  birthday?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 头像地址 */
  avatar?: string
  /** 备注 */
  remark?: string
}

export interface UpdateUserParams {
  /** 业务ID */
  id: string
}

export interface UpdateUserSortParams {
  /** 业务ID */
  id: string
}

export interface UpdateUserStatusParams {
  /** 业务ID */
  id: string
}

export interface UserDetailsVO {
  /** 用户名 */
  name: string
  /** 用户档案 */
  profile: UserProfileVO
  /** 用户ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
  /** 状态(未知:10 启用:20 禁用:30) */
  status: 10 | 20 | 30
  /** 排序优先级(低优先级:10 中等优先级:20 高优先级:30) */
  sort: 10 | 20 | 30
}

export interface UserIdsVO {
  /** 用户ID列表 */
  ids: string[]
}

export interface UserProfileVO {
  /** 昵称 */
  nickName: string
  /** 性别(未知:10 男:20 女:30) */
  sex: 10 | 20 | 30
  /** 出生日期 */
  birthday: string
  /** 邮箱 */
  email: string
  /** 电话号码 */
  phone: string
  /** 头像地址 */
  avatar: string
}
