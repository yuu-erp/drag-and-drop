import { useCallback, useContext, useRef, useState } from 'react'
import { dataMock } from '../constant'
import { Pages } from '../types/data'
import { CalculateContext } from '../contexts'
import { mock } from '../constants/mock'
import { IState } from './useDraggable'

export default function useDappManager() {
  const [pages, setPages] = useState<Pages>([])
  const pagesRef = useRef<Pages>([])

  const setPagesRefLocal = useCallback((pages: Pages, page?: number) => {
    pagesRef.current = pages
    localStorage.setItem('initPages', JSON.stringify(pages))
    if (typeof page === 'number') {
      onChangePageWithCurrentPage(page)
    }
  }, [])

  const onChangePageWithCurrentPage = useCallback((page: number) => {
    console.log('onChangePageWithCurrentPage - page: ', page)
    setPages(pagesRef.current)
  }, [])

  const moveDapp = useCallback((target: HTMLElement, x: number, y: number) => {
    target.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  return { onChangePageWithCurrentPage, pages, setPagesRefLocal, moveDapp }
}
