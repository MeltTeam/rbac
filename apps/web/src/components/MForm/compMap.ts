import type {
  ButtonInstance,
  CascaderInstance,
  CheckboxInstance,
  DatePickerInstance,
  InputInstance,
  InputNumberInstance,
  InputTagInstance,
  MentionInstance,
  RadioInstance,
  RateInstance,
  SelectInstance,
  SelectV2Instance,
  SliderInstance,
  SwitchInstance,
  TimePickerInstance,
  TimeSelectInstance,
  TransferInstance,
  TreeSelectInstance,
  UploadInstance,
} from 'element-plus'
import type { MButtonInstance } from '../MButton'
import {
  ElButton,
  ElCascader,
  ElCheckbox,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElInputTag,
  ElMention,
  ElRadio,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  ElUpload,
} from 'element-plus'
import { MButton } from '../MButton'

export const CompMap = {
  /** 插槽传模板 */
  Template: false,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElInputTag,
  ElMention,
  ElRadio,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  ElUpload,
  MButton,
} as const satisfies Record<string, globalThis.Component | false>

export type TCompMapKey = keyof typeof CompMap

/** 组件实例映射 - 核心映射，其他类型由此推导 */
export interface ICompInstanceMap {
  Template: never
  ElButton: ButtonInstance
  ElCascader: CascaderInstance
  ElCheckbox: CheckboxInstance
  ElDatePicker: DatePickerInstance
  ElInput: InputInstance
  ElInputNumber: InputNumberInstance
  ElInputTag: InputTagInstance
  ElMention: MentionInstance
  ElRadio: RadioInstance
  ElRate: RateInstance
  ElSelect: SelectInstance
  ElSelectV2: SelectV2Instance
  ElSlider: SliderInstance
  ElSwitch: SwitchInstance
  ElTimePicker: TimePickerInstance
  ElTimeSelect: TimeSelectInstance
  ElTransfer: TransferInstance
  ElTreeSelect: TreeSelectInstance
  ElUpload: UploadInstance
  MButton: MButtonInstance
}

/** 组件 Props 映射 - 自动推导 */
export type ICompPropsMap = {
  [K in keyof ICompInstanceMap]: ICompInstanceMap[K] extends { $props: infer P } ? P : Record<string, never>
}

/** 组件 Attrs 映射 - 自动推导 */
export type ICompAttrsMap = {
  [K in keyof ICompInstanceMap]: ICompInstanceMap[K] extends { $attrs: infer A } ? A : Record<string, never>
}

/** 组件 Slots 映射 - 自动推导 */
export type ICompSlotsMap = {
  [K in keyof ICompInstanceMap]: ICompInstanceMap[K] extends { $slots: infer S } ? S : Record<string, never>
}

/** 组件 Events 映射 - 自动推导 */
export type ICompEventsMap = {
  [K in keyof ICompInstanceMap]: ICompInstanceMap[K] extends { $emits: infer E } ? E : Record<string, never>
}
