import type { MenuInstance, MenuProps } from 'element-plus'

export type MMenuProps = Partial<MenuProps> & {}
export interface MMenuInstance extends MenuInstance {
  $props: MMenuProps
}
