import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import {
  HEIGHT_DOCK,
  HEIGHT_PAGINATION,
  HEIGHT_STATUS_BAR,
  NUMBER_COLUMN,
  PADDING_APP,
  screenCheckPoint,
  SIZE_ICON_APP
} from '../constant'

// CalculateState type
export type CalculateState = {
  heightStatusBar: number
  heightDocs: number
  heightPagination: number
  itemWidth: number
  itemHeight: number
  sizeIcon: number
  screenWidth: number
  screenHeight: number
  paddingApp: number
  numberColumn: number
  numberRow: number
  gridWidth: number
  gridHeight: number
  prePadding: number
}

// Interface for context
export interface ICalculateContext extends CalculateState {}

// Props for the provider
interface CalculateProviderProps extends PropsWithChildren {}

// Context definition
export const CalculateContext = React.createContext<ICalculateContext>(null!)

export const CalculateProvider: React.FC<CalculateProviderProps> = ({ children }) => {
  // Calculate the width of each grid item
  const caculateCheckPoint = useCallback(() => {
    const width = innerWidth
    if (width >= screenCheckPoint.desktop) return screenCheckPoint.desktop
    if (width >= screenCheckPoint.tablet) return screenCheckPoint.tablet
    return innerWidth
  }, [])

  // Calculate the number of rows
  const calculateNumberRow = useCallback(
    (
      screenHeight: number,
      itemWidth: number,
      paddingApp: number,
      heightPagination: number,
      heightStatusBar: number,
      heightDocs: number
    ) => {
      const usableHeight = screenHeight - heightPagination - heightStatusBar - heightDocs - paddingApp * 2
      return Math.floor(usableHeight / itemWidth)
    },
    []
  )

  // State management
  const [stateManager, _setStateManager] = useState<CalculateState>(() => {
    const screenWidth = caculateCheckPoint()
    const screenHeight = innerHeight
    const isPortrait = innerWidth < innerHeight

    // const itemWidth = calculateItemWidth(PADDING_APP)
    const itemWidth = 60
    const itemHeight = itemWidth * 1.3

    const numberColumn = NUMBER_COLUMN

    const paddingApp = (screenWidth - numberColumn * itemWidth) / (2 * numberColumn + 2)
    const gridWidth = 2 * paddingApp + itemWidth
    const gridHeight = itemHeight + paddingApp

    const prePadding = (innerWidth - screenWidth) / 2

    const numberRow = calculateNumberRow(
      screenHeight,
      itemWidth,
      PADDING_APP,
      HEIGHT_PAGINATION,
      HEIGHT_STATUS_BAR,
      HEIGHT_DOCK
    )

    return {
      heightStatusBar: HEIGHT_STATUS_BAR,
      heightDocs: HEIGHT_DOCK,
      heightPagination: HEIGHT_PAGINATION,
      sizeIcon: SIZE_ICON_APP,
      itemWidth,
      itemHeight,
      screenWidth,
      screenHeight,
      paddingApp,
      numberColumn,
      numberRow,
      gridWidth,
      prePadding,
      gridHeight
    }
  })

  console.log('stateManager', stateManager)

  // Update state when window resizes
  useEffect(() => {
    console.log('sizeeeeee', innerHeight, innerWidth)
    window.addEventListener('resize', () => window.location.reload())
    return () => window.removeEventListener('resize', () => window.location.reload())
  }, [])

  return <CalculateContext.Provider value={stateManager}>{children}</CalculateContext.Provider>
}
