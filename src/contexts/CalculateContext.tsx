import React, { PropsWithChildren, useState } from 'react'
import { HEIGHT_DOCK, HEIGHT_PAGINATION, HEIGHT_STATUS_BAR, SIZE_ICON_APP } from '../constant'

export type CalculateState = {
  heightStatusBar: number
  heightDocs: number
  heightPagination: number
  itemWidth: number
  sizeIcon: number
  screenWidth: number
  screenHeight: number
}

export interface ICalculateContext extends CalculateState {}

interface CalculateProviderProps extends PropsWithChildren {}

export const CalculateContext = React.createContext<ICalculateContext>(null!)

export const CalculateProvider: React.FC<CalculateProviderProps> = ({ children }) => {
  const [stateManager, _setStateManager] = useState<CalculateState>({
    heightStatusBar: HEIGHT_STATUS_BAR,
    heightDocs: HEIGHT_DOCK,
    heightPagination: HEIGHT_PAGINATION,
    sizeIcon: SIZE_ICON_APP,
    itemWidth: 0,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  })
  return <CalculateContext.Provider value={stateManager}>{children}</CalculateContext.Provider>
}
