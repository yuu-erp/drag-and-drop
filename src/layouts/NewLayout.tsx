import { useCallback, useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import NewDraggableManager from '../components/NewDraggableManager'

export const HEIGHT_DOCK = 120

const CHECKPOINT_COLUMN: Record<number, number> = {
  768: 4,
  1024: 6
}
const CHECKPOINT_HEIGHT_STATUS_BAR: Record<number, number> = {
  768: 60,
  1024: 40
}
const CHECKPOINT_COLUMN_DOCK: Record<number, number> = {
  768: 6,
  1024: 8
}

const CHECKPOINT_SCREEN: Record<number, number> = {
  768: 768,
  1024: 1024
}

const useResponsiveValue = (breakpoints: Record<number, number>, defaultValue: number) => {
  return useCallback(() => {
    const sortedBreakpoints = Object.keys(breakpoints)
      .map(Number)
      .sort((a, b) => a - b)
    let value = defaultValue

    for (const breakpoint of sortedBreakpoints) {
      if (innerWidth >= breakpoint) {
        value = breakpoints[breakpoint]
      }
    }

    return value
  }, [breakpoints, defaultValue])
}

const calculateGridDimensions = (screenWidth: number, columns: number) => {
  const factor = 20 // tỉ lệ tui điều chỉnh và tìm ra con số phù hợp nhất với trải nghiệm nên đừng tò mò
  const outerPadding = screenWidth / (columns * factor)
  const gridGap = outerPadding
  const totalPadding = 2 * outerPadding + (columns - 1) * gridGap
  const itemWidth = (screenWidth - totalPadding) / columns
  console.log({ factor, outerPadding: gridGap, totalPadding, itemWidth })
  return { itemWidth, outerPadding: totalPadding / 2, gridGap }
}

function createGrid(rows: number, columns: number) {
  return Array.from({ length: rows }, (_, y) => Array.from({ length: columns }, (_, x) => ({ x, y }))).flat()
}

const NewLayout = () => {
  const getCheckPointColumn = useResponsiveValue(CHECKPOINT_COLUMN, 4)
  const getCheckPointColumnDock = useResponsiveValue(CHECKPOINT_COLUMN_DOCK, 4)
  const getCheckPointHeightStatusBar = useResponsiveValue(CHECKPOINT_HEIGHT_STATUS_BAR, 60)
  const getCheckPointScreen = useResponsiveValue(CHECKPOINT_SCREEN, innerWidth)

  const [stateManager, _setStateManager] = useState(() => {
    const columns = getCheckPointColumn()
    const { itemWidth, outerPadding, gridGap } = calculateGridDimensions(getCheckPointScreen(), columns)
    const itemHeight = itemWidth * (columns === 4 ? 1.1 : 1)
    const numberRows = Math.floor((innerHeight - getCheckPointHeightStatusBar() - 40 - HEIGHT_DOCK) / itemHeight)

    return {
      screenWidth: getCheckPointScreen(),
      screenHeight: innerHeight,
      heightStatusBar: getCheckPointHeightStatusBar(),
      heightPagination: 40,
      heightDock: HEIGHT_DOCK,
      numberColumn: columns,
      numberRows,
      itemWidth,
      itemHeight,
      outerPadding,
      gridGap,
      widthDock:
        getCheckPointColumnDock() === 4
          ? innerWidth
          : getCheckPointColumnDock() * 60 + getCheckPointColumnDock() * outerPadding
    }
  })

  const [isBlur, _setIsBlur] = useState(true)
  const [theme, _setTheme] = useState<'dark' | 'light'>('light')
  const [dataDock, setDataDock] = useState<number[]>(
    Array.from({ length: getCheckPointColumnDock() }, (_, index) => index)
  )

  const onRemoveDappDock = (value: number) => () => {
    setDataDock((prev) => prev.filter((item) => item !== value))
  }

  useEffect(() => {
    const handleResize = () => window.location.reload()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    heightStatusBar,
    heightPagination,
    heightDock,
    numberColumn,
    numberRows,
    itemWidth,
    outerPadding,
    widthDock,
    itemHeight
  } = stateManager

  return (
    <div className='w-screen h-screen relative shrink-0 overflow-hidden'>
      {/* StatusBar */}
      <div
        style={{ height: `${heightStatusBar}px` }}
        className='flex items-center justify-center absolute top-0 left-0 right-0 z-10'
      >
        StatusBar
      </div>

      {/* Background Image */}
      {/* <div className='absolute inset-0 h-full w-full overflow-x-auto'>
        <div
          className='relative h-full w-full overflow-x-auto'
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/14/a8/e0/14a8e061fa17ed31521f19998c82720d.jpg')`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%', // Chiều cao full, chiều rộng auto
            width: '400vw'
          }}
        >
          {isBlur && (
            <div
              className={cn('absolute inset-0 backdrop-blur z-0', theme === 'dark' ? 'bg-black/20' : 'bg-white/20')}
            />
          )}
          {createGrid(numberRows, numberColumn).map((grid, index) => (
            <div
              key={index}
              className='absolute'
              style={{
                width: itemWidth + 'px',
                height: itemHeight + 'px',
                top: grid.y * itemHeight + getCheckPointHeightStatusBar() + 'px',
                left: grid.x * itemWidth + outerPadding + (innerWidth - getCheckPointScreen()) / 2,
                paddingLeft: outerPadding + 'px',
                paddingRight: outerPadding + 'px'
              }}
            >
              <div className='w-full h-full flex flex-col items-center justify-center'>
                <div className='w-[60px] aspect-square bg-slate-600 rounded-[14px] shadow-sm'></div>
                <p className='line-clamp-1 text-center text-white font-medium text-xs'>Metanode App</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <NewDraggableManager
        style={{
          width: '400vw'
        }}
      >
        {createGrid(numberRows, numberColumn).map((grid, index) => (
          <div
            key={index}
            className='absolute'
            style={{
              width: itemWidth + 'px',
              height: itemHeight + 'px',
              top: grid.y * itemHeight + getCheckPointHeightStatusBar() + 'px',
              left: grid.x * itemWidth + outerPadding + (innerWidth - getCheckPointScreen()) / 2,
              paddingLeft: outerPadding + 'px',
              paddingRight: outerPadding + 'px'
            }}
          >
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <div className='w-[60px] aspect-square bg-slate-600 rounded-[14px] shadow-sm'></div>
              <p className='line-clamp-1 text-center text-white font-medium text-xs'>Metanode App</p>
            </div>
          </div>
        ))}
      </NewDraggableManager>

      {/* Pagination */}
      <div
        style={{
          height: `${heightPagination}px`,
          bottom: `${heightDock}px`
        }}
        className='flex items-center justify-center absolute left-0 right-0 w-full'
      >
        Pagination
      </div>

      {/* Dock */}
      <div
        style={{ height: `${heightDock}px`, paddingLeft: outerPadding + 'px', paddingRight: outerPadding + 'px' }}
        className='absolute left-0 right-0 bottom-0 z-10'
      >
        <div className='w-full h-full flex items-center justify-center'>
          <div
            className={cn(
              'h-full w-full backdrop-blur-xl rounded-[40px] flex items-center transition-all duration-300',
              theme === 'dark' ? 'bg-black/20' : 'bg-white/20',
              getCheckPointColumnDock() === 4 ? 'justify-between' : 'justify-center'
            )}
            style={{
              height: `96px`,
              gap: outerPadding + 'px',
              width: widthDock + 'px',
              paddingLeft: outerPadding + 'px',
              paddingRight: outerPadding + 'px'
            }}
          >
            {dataDock.map((_app, index) => (
              <div
                key={index}
                className='w-[60px] aspect-square bg-slate-600 rounded-[14px] shadow-sm'
                onClick={onRemoveDappDock(_app)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewLayout
