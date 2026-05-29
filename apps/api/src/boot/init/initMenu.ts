import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import { Logger } from '@nestjs/common'
import { CheckEnum, MenuTypeCodeMap, MenuTypeEnum } from '@packages/types'
import { EntityManager } from 'typeorm'
import { CreateMenuDTO } from '@/modules/rbac/menu/app'
import { MenuDomainService } from '@/modules/rbac/menu/domain'

/**
 * 初始化菜单
 * @param appInstance 应用实例
 * @param _configService 配置服务
 * @returns 菜单数量
 */
export async function initMenu(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  _configService: ConfigService,
): Promise<number> {
  const logger = new Logger(initMenu.name)
  logger.log('开始扫描菜单...')
  // 初始化菜单数据
  const initMenus = [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: '/Dashboard/index',
      title: 'views.Dashboard.title',
      icon: 'icon-park-outline:background-color',
      isCache: true,
      isRefresh: true,
      isVisible: false,
    },
    {
      name: 'ColorPalette',
      path: 'color-palette',
      component: '/ColorPalette/index',
      title: 'views.ColorPalette.title',
      icon: 'icon-park-outline:background-color',
      isCache: true,
      isRefresh: true,
      isVisible: false,
    },
    {
      name: 'Test',
      path: 'test',
      component: '/Test/index',
      title: 'views.Test.title',
      icon: 'icon-park-outline:background-color',
      isCache: true,
      isRefresh: true,
      isVisible: false,
    },
    {
      name: 'MenuView',
      path: 'menu',
      component: '/Menu/index',
      title: 'views.Menu.title',
      icon: 'icon-park-outline:background-color',
      isCache: true,
      isRefresh: true,
      isVisible: false,
    },
  ]
  const createMenuDTOList: (CreateMenuDTO & { menuCode: string })[] = []
  const codeSet = new Set<string>()
  let limit = 0
  try {
    for (const menu of initMenus) {
      // 没有就跳过本次
      if (!menu.name) continue
      // 重复就跳过本次
      if (codeSet.has(menu.name)) continue
      codeSet.add(menu.name)
      limit++
      // 初始菜单
      const createMenuDTO = new CreateMenuDTO()
      createMenuDTO.name = menu.name
      createMenuDTO.menuType = MenuTypeEnum.MENU
      createMenuDTO.domain = menu.name.toUpperCase()
      createMenuDTO.action = 'VIEW'
      createMenuDTO.path = menu.path
      createMenuDTO.component = menu.component
      createMenuDTO.title = menu.title
      createMenuDTO.icon = menu.icon
      createMenuDTO.isCache = menu.isCache ? CheckEnum.TRUE : CheckEnum.FALSE
      createMenuDTO.isRefresh = menu.isRefresh ? CheckEnum.TRUE : CheckEnum.FALSE
      createMenuDTO.isVisible = menu.isVisible ? CheckEnum.TRUE : CheckEnum.FALSE
      createMenuDTO.remark = menu.name
      const menuCode = `${MenuTypeCodeMap[MenuTypeEnum.MENU]}:${menu.name.toUpperCase()}:VIEW`
      createMenuDTOList.push({
        ...createMenuDTO,
        menuCode,
      })
    }
    logger.log(`√ 扫描成功`)
    // 服务
    const menuDomainService = appInstance.get(MenuDomainService)
    // 实体管理器(用于操作数据库)
    const entityManager = appInstance.get(EntityManager)
    await entityManager.transaction(async (em: EntityManager) => {
      const codes = new Set<string>()
      const pageSize = 2000
      let page = 1
      while (true) {
        const [menus, total] = await menuDomainService.getMenus({ page, limit: pageSize }, false, em)
        menus.forEach((m) => codes.add(m.menuCode))
        if (page * pageSize >= total) break
        page++
      }
      const newMenus = createMenuDTOList.filter((r) => !codes.has(r.menuCode))
      if (newMenus.length > 0) {
        logger.log(`发现 ${newMenus.length} 个新菜单，开始创建...`)
        const createDTOList = newMenus.map((r) => {
          const createDTO = new CreateMenuDTO()
          createDTO.name = r.name
          createDTO.menuType = r.menuType
          createDTO.domain = r.domain
          createDTO.action = r.action
          createDTO.path = r.path
          createDTO.component = r.component
          createDTO.title = r.title
          createDTO.icon = r.icon
          createDTO.isCache = r.isCache
          createDTO.isRefresh = r.isRefresh
          createDTO.isVisible = r.isVisible
          createDTO.remark = r.remark
          return createDTO
        })
        try {
          await menuDomainService.createMenus(em, createDTOList)
          logger.log(`√ 批量创建菜单成功，共创建 ${newMenus.length} 个新菜单`)
        } catch (err) {
          logger.error(`× 批量创建菜单失败: ${err.message}`, err.stack)
        }
      } else {
        logger.log('没有发现新菜单需要创建')
      }
    })
  } catch (err) {
    logger.error(`菜单扫描失败: ${err.message}`, err.stack)
  }
  return limit
}
