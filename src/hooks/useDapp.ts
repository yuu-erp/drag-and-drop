import { useCallback, useContext } from 'react'
import { CalculateContext } from '../contexts'
import { animate, getTranslateFromTransform } from '../utils'
import { $ } from '../utils/domUtils'

type Position = { x: number; y: number }

export const useDapp = () => {
  const { gridWidth, paddingApp, prePadding, heightStatusBar, gridHeight } = useContext(CalculateContext)

  const moveDapp = useCallback((target: HTMLElement, x: number, y: number) => {
    target.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  const getPosition = useCallback((page: number, position: Position) => {
    const { x, y } = position
    const left = page * innerWidth + x * gridWidth + paddingApp * 2 + prePadding
    const top = y * gridHeight + paddingApp + heightStatusBar
    return [left, top]
  }, [])

  const getXYPage = useCallback((left: number, top: number) => {
    const page = Math.floor(left / innerWidth)

    return {
      page,
      x: (left - prePadding - paddingApp) / gridWidth,
      y: (top - heightStatusBar) / gridHeight
    }
  }, [])

  const findClosestXY = useCallback((target: HTMLElement, currentPage: number) => {
    let { left, top } = getTranslateFromTransform(target)
    if (top < heightStatusBar) return
    left = (left % innerWidth) - currentPage
    return {
      x: Math.round(left / gridWidth),
      y: Math.round((top - heightStatusBar) / gridWidth)
    }
  }, [])

  const snapToPosition = useCallback((target: HTMLElement, toLeft: number, toTop: number) => {
    let { left, top } = getTranslateFromTransform(target)

    animate((progress: number) => {
      moveDapp(target, left + (toLeft - left) * progress, top + (toTop - top) * progress)
    })
  }, [])

  const snapToXY = useCallback((target: HTMLElement, currentPage: number) => {
    const position = findClosestXY(target, currentPage)
    const a = target.getAttribute('data-left')
    const b = target.getAttribute('data-top')

    // const [toX, toY] = position ? getPosition(currentPage, position):
    // snapToPosition(target, toX, toY)
  }, [])

  return { getPosition, findClosestXY, snapToXY, snapToPosition, moveDapp }
}
