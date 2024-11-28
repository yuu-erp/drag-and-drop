import React, { PropsWithChildren, useCallback, useState, useEffect } from 'react'
import { HEIGHT_DOCK, HEIGHT_PAGINATION, HEIGHT_STATUS_BAR, PADDING_APP, SIZE_ICON_APP } from '../constant'

// CalculateState type
export type CalculateState = {
  heightStatusBar: number
  heightDocs: number
  heightPagination: number
  itemWidth: number
  sizeIcon: number
  screenWidth: number
  screenHeight: number
  paddingApp: number
  numberColumn: number
  numberRow: number
}

// Interface for context
export interface ICalculateContext extends CalculateState {}

// Props for the provider
interface CalculateProviderProps extends PropsWithChildren {}

// Context definition
export const CalculateContext = React.createContext<ICalculateContext>(null!)

export const CalculateProvider: React.FC<CalculateProviderProps> = ({ children }) => {
  // Calculate the width of each grid item
  const calculateItemWidth = useCallback((paddingApp: number) => {
    const columns = 4 // Fixed number of columns
    return Math.floor((window.innerWidth - paddingApp) / columns)
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
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const itemWidth = calculateItemWidth(PADDING_APP)
    const numberColumn = 4
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
      screenWidth,
      screenHeight,
      paddingApp: PADDING_APP,
      numberColumn,
      numberRow
    }
  })

  // Update state when window resizes
  useEffect(() => {
    window.addEventListener('resize', () => window.location.reload())
    return () => window.removeEventListener('resize', () => window.location.reload())
  }, [])

  return <CalculateContext.Provider value={stateManager}>{children}</CalculateContext.Provider>
}
