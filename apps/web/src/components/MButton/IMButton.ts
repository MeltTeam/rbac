import type { ButtonInstance, ButtonProps } from 'element-plus'

export type MButtonProps = {} & ButtonProps
export interface MButtonInstance extends ButtonInstance {
  $props: MButtonProps
  $slots: ButtonInstance['$slots'] & {}
}
