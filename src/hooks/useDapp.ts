import { useContext } from 'react'
import { CalculateContext } from '../contexts'

export const useDapp = () => {
  const { gridWidth, paddingApp, prePadding, heightStatusBar } = useContext(CalculateContext)

  const getPosition = (page: number, position: { x: number; y: number }) => {
    const { x, y } = position
    const left = page * innerWidth + x * gridWidth + paddingApp + prePadding
    const top = y * gridWidth + paddingApp + heightStatusBar
    return [left, top]
  }

  return { getPosition }
}
