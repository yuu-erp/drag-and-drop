import { useCallback, useEffect } from 'react'
import Dock from '../components/Dock'
import DraggableManager from '../components/DraggableManager'
import Pagination from '../components/Pagination'
import StatusBar from '../components/StatusBar'
import { delay } from '../utils'
import { dataMock } from '../constant'
import useSetting from '../hooks/useSetting'
import useCalculate from '../hooks/useCalculate'
import useDraggable from '../hooks/useDraggable'
import { mock } from '../constants/mock'

export default function MainLayout() {
  const { setIsLoadingSetting, isLoadingSetting, currentPage } = useSetting()
  const { heightStatusBar, heightPagination, heightDocs, screenWidth } = useCalculate()

  const { setPagesRefLocal, pagesRef, pages, totalPage } = useDraggable()

  const fetchData = useCallback(async () => {
    setIsLoadingSetting(true)
    try {
      await delay(1000)
      setPagesRefLocal(mock, currentPage.current)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingSetting(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  console.log('MainLayout - pages: ', pages)
  if (isLoadingSetting) {
    return (
      <div className='bg-[#242424] fixed inset-0 w-screen h-screen flex items-center justify-center text-lg'>
        Loading...
      </div>
    )
  }
  return (
    <div className='h-screen w-screen flex flex-col relative'>
      <StatusBar
        className='absolute left-0 top-0 w-full z-10'
        style={{
          height: heightStatusBar + 'px'
        }}
      />
      <DraggableManager
        ref={pagesRef}
        pages={pages}
        style={{
          width: totalPage * innerWidth + 'px'
        }}
      />
      <Pagination
        className='z-10 absolute w-full'
        style={{
          height: heightPagination + 'px',
          bottom: heightDocs + 'px'
        }}
      />
      <Dock
        className='absolute bottom-0 left-0 z-10 w-full'
        style={{
          height: heightDocs + 'px'
        }}
      />
    </div>
  )
}
