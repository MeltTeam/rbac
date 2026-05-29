import type { CardInstance, CardProps } from 'element-plus'

export type MCardProps = {} & CardProps
export interface MCardInstance extends CardInstance {
  $props: MCardProps
}
