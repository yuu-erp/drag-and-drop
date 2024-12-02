// useDraggable.tsx
import { useCallback, useEffect, useRef } from 'react'
import usePageManager from './usePageManager'
import useSetting from './useSetting'
import { getClientCoordinates, getEventTypes } from './useTouchMouseEvents'
import { getTranslateFromTransform, wait } from '../utils'
import useDappManager from './useDappManager'

export interface IState {
  isMoving: boolean
  startX: number
  startY: number
  timeStart: number
  lastWheelTime: number
  scrollLeft: number
  isRequestingFrame: boolean
  target?: HTMLElement
  targetLeft: number
  targetTop: number
  accumulatedDelta: number
  intervalMovePage?: any
}

const initDragState: IState = {
  isMoving: false,
  startX: 0,
  startY: 0,
  timeStart: 0,
  lastWheelTime: 0,
  scrollLeft: 0,
  isRequestingFrame: false,
  targetLeft: 0,
  targetTop: 0,
  accumulatedDelta: 0
}

export default function useDraggable() {
  const { currentPage, setCurrentPage } = useSetting()
  const pagesRef = useRef<HTMLDivElement>(null!)

  const { movePage, scrollToPage, scrollToPageNotrequestAnimationFrame } = usePageManager(pagesRef)
  const { moveDapp, snapTo } = useDappManager()

  const isTouch = 'ontouchstart' in window
  // Combine all draggable state into one ref object for better readability and maintenance
  const dragState = useRef({ ...initDragState })
  // Store event handlers using useRef to avoid re-creating them on each render
  const onStartDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})
  const onMoveDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})
  const onEndDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})
  const onWheelRef = useRef<(event: WheelEvent) => void>(() => {})

  const resetDragState = useCallback(() => {
    console.log('reset 1')
    removeTarget()
    removeMovePage()
    dragState.current = { ...initDragState }
  }, [])

  // Create event handlers with useCallback to prevent re-creation on each render
  const onStartDraggable = useCallback((event: TouchEvent | MouseEvent): void => {
    if (!pagesRef.current) return
    dragState.current.timeStart = performance.now() // Track start time
    dragState.current.isMoving = true
    const { clientX, clientY } = getClientCoordinates(event)
    dragState.current.startX = clientX
    dragState.current.startY = clientY
    dragState.current.scrollLeft = pagesRef.current.scrollLeft || 0
    const target = event.target as HTMLElement
    if (target.getAttribute('datatype') === 'dapp') {
      const parent = target.parentNode?.parentNode as HTMLElement
      addTarget(parent)
      const { left, top } = getTranslateFromTransform(parent)
      dragState.current.targetLeft = left % innerWidth
      dragState.current.targetTop = top
    }
  }, [])

  const onMoveDraggable = useCallback(
    (event: TouchEvent | MouseEvent): void => {
      console.log('touch move')
      if (!dragState.current.isMoving || !pagesRef.current) return
      // Tính toán vị trí hiện tại và khoảng cách di chuyển
      const { clientX, clientY } = getClientCoordinates(event)
      const walkX = clientX - dragState.current.startX
      const walkY = clientY - dragState.current.startY
      const deltaTime = performance.now() - dragState.current.timeStart
      //Logic giữ yên để move dapp
      if (Math.abs(walkX) > 1 && deltaTime < 300) {
        removeTarget()
      }
      // Ngưỡng di chuyển nhỏ để bỏ qua các jitter không đáng kể
      const deltaThreshold = 2
      if (Math.abs(walkX) < deltaThreshold) return
      if (!dragState.current.isRequestingFrame) {
        dragState.current.isRequestingFrame = true
        const { scrollLeft, target, targetLeft, targetTop, intervalMovePage, isMoving } = dragState.current
        requestAnimationFrame(() => {
          if (target) {
            moveDapp(target, targetLeft + walkX, targetTop + walkY)
            console.log('clientX', clientX, innerWidth - 40)
            // if (clientX < 40 || clientX > innerWidth - 40) {
            //   console.log('iisiiss', isMoving)
            //   if (!dragState.current.intervalMovePage && isMoving) {
            //     let page = currentPage.current
            //     dragState.current.intervalMovePage = setInterval(() => {
            //       console.log('interval')
            //       page += 1
            //       scrollToPage(page)
            //     }, 1000)
            //   }
            // } else {
            //   console.log('reset 2')
            //   removeMovePage()
            // }
          } else {
            movePage(scrollLeft - walkX) // Di chuyển trang
          }

          dragState.current.isRequestingFrame = false // Reset trạng thái
        })
      }
    },
    [movePage, currentPage.current]
  )

  const onEndDraggable = useCallback(
    (event: TouchEvent | MouseEvent): void => {
      console.log('touch end')
      if (!dragState.current.isMoving || !pagesRef.current) return
      dragState.current.isMoving = false
      const { target } = dragState.current
      const { clientX } = getClientCoordinates(event)

      // Tính toán velocity
      const deltaX = clientX - dragState.current.startX
      const deltaTime = performance.now() - dragState.current.timeStart
      if (target) {
        snapTo(target, currentPage.current)
        resetDragState()

        return
      }

      // Kiểm tra giá trị deltaX và deltaTime
      const MAX_TIME = 1000 // Giới hạn thời gian tối đa kéo (1 giây)
      const adjustedDeltaTime = Math.min(deltaTime, MAX_TIME)
      const velocity = Math.abs(deltaX / adjustedDeltaTime)
      // Ngưỡng tốc độ (tùy chỉnh theo yêu cầu)
      const VELOCITY_THRESHOLD = 0.3 // Tốc độ đủ để chuyển trang
      const pageWidth = pagesRef.current?.clientWidth || 1 // Tránh chia cho 0
      const DISTANCE_THRESHOLD = pageWidth * 0.5 // Ngưỡng kéo 50% trang
      const maxPage = Math.ceil(pagesRef.current.scrollWidth / pageWidth) - 1 // Tính page max được tính từ 0
      // Xác định trang mục tiêu
      if (velocity > VELOCITY_THRESHOLD || Math.abs(deltaX) > DISTANCE_THRESHOLD) {
        // Dựa vào hướng kéo để xác định trang
        if (deltaX > 0) {
          currentPage.current = Math.max(0, currentPage.current - 1)
        } else {
          currentPage.current = Math.min(maxPage, currentPage.current + 1)
        }
      }
      scrollToPage(currentPage.current, () => setCurrentPage(currentPage.current))
      resetDragState()
    },
    [scrollToPage, resetDragState]
  )

  const onWheel = useCallback((event: WheelEvent) => {
    if (!pagesRef.current) return
    console.log('onWheel - event: ', { deltaX: event.deltaX, deltaY: event.deltaY })
  }, [])

  const addTarget = (target: HTMLElement) => {
    target.style.position = 'fixed'
    target.querySelector('p')!.style.color = 'transparent'
    dragState.current.target = target
  }

  const removeTarget = () => {
    const target = dragState.current.target
    if (target) {
      console.log('aaa')
      target.querySelector('p')!.style.color = '#ffffff'
      target.style.position = 'absolute'
      delete dragState.current.target
    }
  }

  const removeMovePage = () => {
    if (dragState.current.intervalMovePage) {
      clearInterval(dragState.current.intervalMovePage)
      delete dragState.current.intervalMovePage
    }
  }

  // Assign the callback functions to the refs so they persist between renders
  useEffect(() => {
    onStartDraggableRef.current = onStartDraggable
    onMoveDraggableRef.current = onMoveDraggable
    onEndDraggableRef.current = onEndDraggable
    onWheelRef.current = onWheel
    if (pagesRef.current) {
      scrollToPageNotrequestAnimationFrame(currentPage.current)
    }
  }, [onStartDraggable, onMoveDraggable, onEndDraggable, pagesRef])

  // Effect to handle adding and removing event listeners
  useEffect(() => {
    const { start, move, end } = getEventTypes(isTouch)
    const handleStart = (event: Event) => onStartDraggableRef.current(event as TouchEvent | MouseEvent)
    const handleMove = (event: Event) => onMoveDraggableRef.current(event as TouchEvent | MouseEvent)
    const handleEnd = (event: Event) => onEndDraggableRef.current(event as TouchEvent | MouseEvent)
    // const handleWheel = (event: Event) => onWheelRef.current(event as WheelEvent)

    document.addEventListener(start, handleStart)
    document.addEventListener(move, handleMove)
    document.addEventListener(end, handleEnd)
    // document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener(start, handleStart)
      document.removeEventListener(move, handleMove)
      document.removeEventListener(end, handleEnd)
      // document.removeEventListener('wheel', handleWheel)
    }
  }, [isTouch])

  return { pagesRef }
}
