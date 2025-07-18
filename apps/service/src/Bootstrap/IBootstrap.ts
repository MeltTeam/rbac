export interface IBootstrap {
  /** 初始化 */
  init: () => Promise<void>

  /** 监听 */
  listen: () => Promise<void>
}
