import type { AsideInstance } from 'element-plus'

export interface MAsideProps {
  width?: string
  headerHeight?: string
  footerHeight?: string
}
export interface MAsideInstance extends AsideInstance {
  $props: MAsideProps
  $slots: AsideInstance['$slots'] & {
    header?: (props: object) => any
    footer?: (props: object) => any
  }
}
