import { useCallback, useRef, useState } from 'react'
import { Pages } from '../types/data'
import { useDapp2 } from './useDapp2'

export default function useDappManager() {
  const [pages, setPages] = useState<Pages>([])
  const [totalPage, setTotalPage] = useState(0)
  const dapp2 = useDapp2()

  const pagesRef = useRef<Pages[]>([])

  const setPagesRefLocal = useCallback((pages: Pages[], page?: number) => {
    pagesRef.current = pages
    setTotalPage(pages.length)
    localStorage.setItem('initPages', JSON.stringify(pages))
    if (typeof page === 'number') {
      if (page % 2 !== 0) page -= 1

      onChangePageWithCurrentPage(page)
    }
  }, [])

  const onChangePageWithCurrentPage = useCallback((page: number) => {
    if (page % 2 !== 0) return
    // chon 5 page 2 page truoc 2 page sau so voi page hien tai (page)
    const array = [page - 2, page - 1, page, page + 1, page + 2]
    const currentPages = array
      .map((item) => pagesRef.current[item])
      .filter(Boolean)
      .flat()

    setPages(currentPages)
  }, [])

  return { onChangePageWithCurrentPage, pages, setPagesRefLocal, totalPage, ...dapp2 }
}
