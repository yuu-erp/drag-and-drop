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

  const { setPagesRefLocal, pagesRef, pages } = useDraggable()

  const fetchData = useCallback(async () => {
    setIsLoadingSetting(true)
    try {
      await delay(1000)
      setPagesRefLocal(mock.flat(), currentPage.current)
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
    <div className='h-screen w-screen flex flex-col'>
      {/* <StatusBar
        style={{
          height: heightStatusBar + 'px'
        }}
      /> */}
      <DraggableManager
        ref={pagesRef}
        pages={pages}
        style={{
          width: pages.length * screenWidth + 'px'
        }}
      />
      {/* <Pagination
        style={{
          height: heightPagination + 'px'
        }}
      /> */}
      {/* <Dock
        style={{
          height: heightDocs + 'px'
        }}
      /> */}
    </div>
  )
}
