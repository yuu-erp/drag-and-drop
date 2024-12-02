export const HEIGHT_DOCK = 120
export const HEIGHT_PAGINATION = 40
export const SIZE_ICON = 120

export enum Device {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP'
}
// Use the enum in CHECKPOINT_DEVICE
export const CHECKPOINT_DEVICE: Record<number, Device> = {
  768: Device.TABLET,
  1024: Device.DESKTOP
}

export const CHECKPOINT_COLUMN: Record<number, number> = {
  768: 4,
  1024: 6
}
export const CHECKPOINT_HEIGHT_STATUS_BAR: Record<number, number> = {
  768: 60,
  1024: 40
}
export const CHECKPOINT_COLUMN_DOCK: Record<number, number> = {
  768: 6,
  1024: 8
}

export const CHECKPOINT_SCREEN: Record<number, number> = {
  768: 768,
  1024: 1024
}
