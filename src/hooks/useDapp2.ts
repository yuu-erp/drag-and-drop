import { useCallback } from 'react'
import useCalculate from './useCalculate2'
import { animate, getTranslateFromTransform } from '../utils'
import { $ } from '../utils/domUtils'

export const useDapp2 = () => {
  const {
    heightStatusBar,
    heightPagination,
    heightDock,
    outerPadding,
    widthDock,
    columnDockNumber,
    device,
    columnNumber,
    rowsNumber,
    itemWidth,
    itemHeight,
    screenCheckPoint
  } = useCalculate()

  const snapTo = (target: HTMLElement, page: number) => {
    const { left, top } = getClosest(target, page)
    animateSnap(target, left, top)
  }

  const getClosest = (target: HTMLElement, page: number) => {
    const { left, top } = getTranslateFromTransform(target)

    const oldLeft = target.getAttribute('data-left')
    const oldTop = target.getAttribute('data-top')

    // left  = left % innerWidth
    const x = Math.round((left - outerPadding - (innerWidth - screenCheckPoint) / 2) / itemWidth)
    const y = Math.round((top - heightStatusBar) / itemHeight)

    const _new = getPosition(x, y, page)
    const exist = $(`[data-left="${_new.left}"][data-top="${_new.top}"]`)
    if (exist || top < heightStatusBar || y > rowsNumber - 1) {
      return {
        left: +oldLeft!,
        top: +oldTop!
      }
    }
    return _new
  }

  const animateSnap = useCallback((target: HTMLElement, toLeft: number, toTop: number) => {
    let { left, top } = getTranslateFromTransform(target)

    animate((progress: number) => {
      moveDapp(target, left + (toLeft - left) * progress, top + (toTop - top) * progress)
    })
  }, [])

  const getPosition = useCallback((x: number, y: number, page: number) => {
    return {
      top: y * itemHeight + heightStatusBar,
      left: innerWidth * page + x * itemWidth + outerPadding + (innerWidth - screenCheckPoint) / 2
    }
  }, [])

  const moveDapp = useCallback((target: HTMLElement, left: number, top: number) => {
    target.style.transform = `translate(${left}px, ${top}px)`
  }, [])

  return {
    getPosition,
    moveDapp,
    snapTo
  }
}
