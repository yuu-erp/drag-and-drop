import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import {
  CHECKPOINT_COLUMN,
  CHECKPOINT_COLUMN_DOCK,
  CHECKPOINT_DEVICE,
  CHECKPOINT_HEIGHT_STATUS_BAR,
  CHECKPOINT_SCREEN,
  Device,
  HEIGHT_DOCK,
  HEIGHT_PAGINATION,
  SIZE_ICON
} from '../constant2'

// CalculateState type
export type CalculateState = {
  heightStatusBar: number
  heightPagination: number
  heightDock: number
  widthDock: number

  screenWidth: number
  screenHeight: number
  screenCheckPoint: number
  device: Device

  columnNumber: number
  rowsNumber: number
  columnDockNumber: number
  sizeIcon: number
  itemWidth: number
  itemHeight: number
  outerPadding: number
}
// Interface for context
export interface ICalculateContext extends CalculateState {}
// Props for the provider
interface CalculateProviderProps extends PropsWithChildren {}
// Context definition
export const CalculateContext = React.createContext<ICalculateContext>(null!)

export const CalculateProvider: React.FC<CalculateProviderProps> = ({ children }) => {
  // get check point
  const getCheckPointColumn = useResponsiveValue(CHECKPOINT_COLUMN, 4)
  const getCheckPointColumnDock = useResponsiveValue(CHECKPOINT_COLUMN_DOCK, 4)
  const getCheckPointHeightStatusBar = useResponsiveValue(CHECKPOINT_HEIGHT_STATUS_BAR, 60)
  const getCheckPointScreen = useResponsiveValue(CHECKPOINT_SCREEN, innerWidth)
  const getCheckPointDevice = useResponsiveValue(CHECKPOINT_DEVICE, Device.MOBILE)
  console.log('getCheckPointColumnDock: ', getCheckPointColumnDock())
  // State management
  const [stateManager, _setStateManager] = useState<CalculateState>(() => {
    const columnNumber = getCheckPointColumn()
    const columnDockNumber = getCheckPointColumnDock()
    const heightStatusBar = getCheckPointHeightStatusBar()
    const screenCheckPoint = getCheckPointScreen()
    const device = getCheckPointDevice()
    const { itemWidth, outerPadding } = calculateGridDimensions(getCheckPointScreen(), columnNumber)
    const itemHeight = itemWidth * (device === 'MOBILE' ? 1.1 : 1)
    const rowsNumber = Math.floor((innerHeight - heightStatusBar - HEIGHT_PAGINATION - HEIGHT_DOCK) / itemHeight)
    const widthDock = device === 'MOBILE' ? innerWidth : columnDockNumber * SIZE_ICON + columnDockNumber * outerPadding
    console.log(widthDock)
    return {
      heightStatusBar,
      heightPagination: HEIGHT_PAGINATION,
      heightDock: HEIGHT_DOCK,
      widthDock,

      screenWidth: innerWidth,
      screenHeight: innerHeight,
      screenCheckPoint,
      device,

      columnNumber,
      rowsNumber,
      columnDockNumber,
      sizeIcon: SIZE_ICON,
      itemWidth,
      itemHeight,
      outerPadding
    }
  })

  console.log('stateManager', stateManager)

  // Update state when window resizes
  useEffect(() => {
    window.addEventListener('resize', () => window.location.reload())
    return () => window.removeEventListener('resize', () => window.location.reload())
  }, [])

  return <CalculateContext.Provider value={stateManager}>{children}</CalculateContext.Provider>
}
const calculateGridDimensions = (screenWidth: number, columns: number) => {
  const factor = 20 // tỉ lệ tui điều chỉnh và tìm ra con số phù hợp nhất với trải nghiệm nên đừng tò mò
  const outerPadding = screenWidth / (columns * factor)
  const gridGap = outerPadding
  const totalPadding = 2 * outerPadding + (columns - 1) * gridGap
  const itemWidth = (screenWidth - totalPadding) / columns
  console.log({ factor, outerPadding: gridGap, totalPadding, itemWidth })
  return { itemWidth, outerPadding: totalPadding / 2 }
}

const useResponsiveValue = <T extends number | string>(breakpoints: Record<number, T>, defaultValue: T) => {
  return useCallback(() => {
    const sortedBreakpoints = Object.keys(breakpoints)
      .map(Number)
      .sort((a, b) => a - b)
    let value = defaultValue

    for (const breakpoint of sortedBreakpoints) {
      if (innerWidth >= breakpoint) {
        value = breakpoints[breakpoint]
      }
    }

    return value
  }, [breakpoints, defaultValue])
}
