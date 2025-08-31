/** 应用引导类接口 */
export interface IBootstrap {
  /** 初始化配置 */
  initConfig: () => Promise<void>

  /** 检查初始化配置 */
  checkInitConfig: () => Promise<void>

  /** 初始化中间件 */
  initMiddlewares: () => Promise<void>

  /** 初始化管道验证 */
  initPipes: () => Promise<void>

  /** 初始化全局设置 */
  initGlobalSettings: () => Promise<void>

  /** 监听 */
  listen: () => Promise<void>

  /** 启用热重载 */
  enableHotReload: () => void
}
