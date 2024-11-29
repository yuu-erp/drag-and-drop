// useDraggable.tsx
import { useCallback, useEffect, useRef } from 'react'
import usePageManager from './usePageManager'
import useSetting from './useSetting'
import { getClientCoordinates, getEventTypes } from './useTouchMouseEvents'
import useDappManager from './useDappManager'
import { getTranslateFromTransform } from '../utils'
import { useDapp } from './useDapp'

export interface IState {
  isMoving: boolean
  startX: number
  startY: number
  timeStart: number
  scrollLeft: number
  isRequestingFrame: boolean
  target?: HTMLElement
  targetLeft: number
  targetTop: number
}

const initDragState: IState = {
  isMoving: false,
  startX: 0,
  startY: 0,
  timeStart: 0,
  scrollLeft: 0,
  isRequestingFrame: false,
  targetLeft: 0,
  targetTop: 0
}

export default function useDraggable() {
  const { currentPage, setCurrentPage } = useSetting()
  const pagesRef = useRef<HTMLDivElement>(null!)

  const { movePage, scrollToPage, scrollToPageNotrequestAnimationFrame } = usePageManager(pagesRef)
  const { onChangePageWithCurrentPage, pages, setPagesRefLocal } = useDappManager()
  const { snapToXY, moveDapp } = useDapp()

  const isTouch = 'ontouchstart' in window
  // Combine all draggable state into one ref object for better readability and maintenance
  const dragState = useRef({ ...initDragState })
  // Store event handlers using useRef to avoid re-creating them on each render
  const onStartDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})
  const onMoveDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})
  const onEndDraggableRef = useRef<(event: TouchEvent | MouseEvent) => void>(() => {})

  const addTarget = (target: HTMLElement) => {
    target.style.position = 'fixed'
    dragState.current.target = target
  }

  const removeTarget = () => {
    const target = dragState.current.target
    if (target) {
      target.style.position = 'absolute'
      delete dragState.current.target
    }
  }

  const resetDragState = useCallback(() => {
    removeTarget()
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
    const type = target.getAttribute('datatype')
    if (type === 'dapp') {
      addTarget(target)
      const { x, y } = getTranslateFromTransform(target)
      dragState.current.targetLeft = x
      dragState.current.targetTop = y
    }
  }, [])

  const onMoveDraggable = useCallback(
    (event: TouchEvent | MouseEvent): void => {
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
      const deltaThreshold = 5
      if (Math.abs(walkX) < deltaThreshold) return
      if (!dragState.current.isRequestingFrame) {
        dragState.current.isRequestingFrame = true
        const { scrollLeft, startX, startY, targetLeft, targetTop, target } = dragState.current

        // Chỉ tính toán và cập nhật khi màn hình sẵn sàng vẽ
        requestAnimationFrame(() => {
          if (target) {
            moveDapp(target, (targetLeft + walkX) % innerWidth, targetTop + walkY)
          } else {
            movePage(scrollLeft - walkX) // Di chuyển trang
          }
          dragState.current.isRequestingFrame = false // Reset trạng thái
        })
      }
    },
    [movePage]
  )

  const onEndDraggable = useCallback(
    (event: TouchEvent | MouseEvent): void => {
      if (!dragState.current.isMoving || !pagesRef.current) return
      const { target } = dragState.current
      const { clientX } = getClientCoordinates(event)

      // Tính toán velocity
      const deltaX = clientX - dragState.current.startX
      const deltaTime = performance.now() - dragState.current.timeStart
      if (target) {
        snapToXY(target, currentPage.current)
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
      console.log('currentPage: ', currentPage.current)
      onChangePageWithCurrentPage(currentPage.current)
      scrollToPage(currentPage.current, () => setCurrentPage(currentPage.current))
      resetDragState()
    },
    [scrollToPage, resetDragState]
  )
  // Assign the callback functions to the refs so they persist between renders
  useEffect(() => {
    if (!pages || !pages.length || pages.length < 1) return
    onStartDraggableRef.current = onStartDraggable
    onMoveDraggableRef.current = onMoveDraggable
    onEndDraggableRef.current = onEndDraggable
    if (pagesRef.current) {
      scrollToPageNotrequestAnimationFrame(currentPage.current)
    }
  }, [onStartDraggable, onMoveDraggable, onEndDraggable, pagesRef, pages])

  // Effect to handle adding and removing event listeners
  useEffect(() => {
    const { start, move, end } = getEventTypes(isTouch)
    const handleStart = (event: Event) => onStartDraggableRef.current(event as TouchEvent | MouseEvent)
    const handleMove = (event: Event) => onMoveDraggableRef.current(event as TouchEvent | MouseEvent)
    const handleEnd = (event: Event) => onEndDraggableRef.current(event as TouchEvent | MouseEvent)

    document.addEventListener(start, handleStart)
    document.addEventListener(move, handleMove)
    document.addEventListener(end, handleEnd)

    return () => {
      document.removeEventListener(start, handleStart)
      document.removeEventListener(move, handleMove)
      document.removeEventListener(end, handleEnd)
    }
  }, [isTouch])

  return { pagesRef, pages, setPagesRefLocal }
}
