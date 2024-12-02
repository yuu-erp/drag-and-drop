import { useState } from 'react'
import Dock from '../components/features/home/Dock'
import DraggableManager from '../components/features/home/DraggableManager'
import Pagination from '../components/features/home/Pagination'
import StatusBar from '../components/features/home/StatusBar'
import DappComponent from '../components/shared/DappComponent'
import useCalculate from '../hooks/useCalculate2'
import { createGrid } from '../utils/math'
import useDraggable from '../hooks/useDraggable2'
import { mock } from '../constants/mock'
import { useDapp2 } from '../hooks/useDapp2'

const mockPage = 4

export default function MainLayout() {
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
  const { pagesRef } = useDraggable()
  const [dataDock, setDataDock] = useState<number[]>(Array.from({ length: columnDockNumber }, (_, index) => index))

  const onRemoveDappDock = (value: number) => () => {
    setDataDock((prev) => prev.filter((item) => item !== value))
  }

  const { getPosition } = useDapp2()

  return (
    <div className='w-screen h-screen relative shrink-0 overflow-hidden'>
      <StatusBar
        style={{
          height: heightStatusBar + 'px'
        }}
      />
      <DraggableManager
        ref={pagesRef}
        isBgScroll={false}
        isBlur={false}
        style={{
          width: mockPage * innerWidth + 'px'
        }}
      >
        {[...new Array(mockPage)].map((page, pageIdx) =>
          createGrid(rowsNumber, columnNumber).map((grid, index) => {
            const { top, left } = getPosition(grid.x, grid.y, pageIdx)

            return (
              <DappComponent
                data-top={top}
                data-left={left}
                key={index}
                className='absolute'
                style={{
                  width: itemWidth + 'px',
                  height: itemHeight + 'px',
                  transform: `translate(${left}px,${top}px)`,
                  top: 0,
                  left: 0,
                  paddingLeft: outerPadding + 'px',
                  paddingRight: outerPadding + 'px'
                }}
              />
            )
          })
        )}
        {/* {mock.map((dapp, index) => (
          <div
            className='h-full flex items-center justify-center shrink z-10'
            style={{
              width: innerWidth + 'px'
            }}
          >
            {index}
          </div>
        ))} */}
      </DraggableManager>
      <Pagination
        style={{
          height: heightPagination + 'px',
          bottom: `${heightDock}px`
        }}
      />
      <Dock
        theme='light'
        style={{ height: `${heightDock}px`, paddingLeft: outerPadding + 'px', paddingRight: outerPadding + 'px' }}
        styleContainer={{
          height: `96px`,
          gap: outerPadding + 'px',
          width: device === 'MOBILE' ? '100%' : widthDock + 'px',
          paddingLeft: outerPadding + 'px',
          paddingRight: outerPadding + 'px'
        }}
        className='justify-center'
      >
        {dataDock.map((_app, index) => (
          <DappComponent
            key={index}
            style={{
              width: itemWidth + 'px',
              height: itemHeight + 'px'
            }}
            isShowName={false}
            onClick={onRemoveDappDock(_app)}
          />
        ))}
      </Dock>
    </div>
  )
}
