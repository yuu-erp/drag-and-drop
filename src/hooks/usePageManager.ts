import { useCallback } from 'react'

export default function usePageManager(elementRef: React.RefObject<HTMLDivElement>) {
  const scrollToPage = useCallback(
    (targetPage: number, callback?: () => void, duration: number = 300) => {
      if (!elementRef.current) return
      const pageWidth = elementRef.current.offsetWidth
      const targetPosition = targetPage * pageWidth
      const startPosition = elementRef.current.scrollLeft
      const distance = targetPosition - startPosition

      const startTime = performance.now()

      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)
        const ease = progress < 0.5 ? 2 * progress ** 2 : 1 - (-2 * progress + 2) ** 2 / 2
        elementRef.current!.scrollLeft = startPosition + distance * ease

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          if (callback && typeof callback === 'function') {
            callback()
          }
        }
      }

      requestAnimationFrame(animateScroll)
    },
    [elementRef]
  )

  const movePage = useCallback(
    (to: number) => {
      if (!elementRef.current) return
      elementRef.current.scrollLeft = to
    },
    [elementRef]
  )

  const scrollToPageNotrequestAnimationFrame = useCallback(
    (page: number = 0) => {
      if (!elementRef.current) return
      const to = elementRef.current.offsetWidth * page
      elementRef.current.scrollLeft = to
    },
    [elementRef]
  )

  return { scrollToPage, movePage, scrollToPageNotrequestAnimationFrame }
}
