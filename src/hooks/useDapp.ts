import { useCallback, useContext } from 'react'
import { CalculateContext } from '../contexts'
import { animate, getTranslateFromTransform } from '../utils'

type Position = { x: number; y: number }
export const useDapp = () => {
  const { gridWidth, paddingApp, prePadding, heightStatusBar } = useContext(CalculateContext)

  const moveDapp = useCallback((target: HTMLElement, x: number, y: number) => {
    target.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  const getPosition = useCallback((page: number, position: Position) => {
    const { x, y } = position
    const left = page * innerWidth + x * gridWidth + paddingApp + prePadding
    const top = y * gridWidth + paddingApp + heightStatusBar
    return [left, top]
  }, [])

  const findClosest = useCallback((target: HTMLElement, currentPage: number) => {
    let { x, y } = getTranslateFromTransform(target)
    if (y < heightStatusBar) throw new Error('In header')
    x = (x % innerWidth) - currentPage
    return {
      x: Math.round(x / gridWidth),
      y: Math.round((y - heightStatusBar) / gridWidth)
    }
  }, [])

  const snapToPosition = useCallback((target: HTMLElement, toX: number, toY: number) => {
    let { x, y } = getTranslateFromTransform(target)

    animate((progress: number) => {
      moveDapp(target, x + (toX - x) * progress, y + (toY - y) * progress)
    })
  }, [])

  const snapToXY = useCallback((target: HTMLElement, currentPage: number) => {
    const position = findClosest(target, currentPage)
    const [toX, toY] = getPosition(currentPage, position)
    snapToPosition(target, toX, toY)
  }, [])

  return { getPosition, findClosest, snapToXY, snapToPosition, moveDapp }
}
