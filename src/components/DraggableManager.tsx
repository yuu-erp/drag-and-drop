import React, { HTMLAttributes, useContext } from 'react'
import { cn } from '../lib/utils'
import { Pages } from '../types/data'
import useCalculate from '../hooks/useCalculate'
import { createGrid } from '../utils/math'
import { CalculateContext } from '../contexts'
import { useDapp } from '../hooks/useDapp'

interface DraggableManagerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  pages?: Pages
}
const DraggableManager = React.forwardRef<HTMLDivElement, DraggableManagerProps>((props, ref) => {
  const { pages = [], className, ...rest } = props
  const { getPosition } = useDapp()
  const { itemWidth } = useCalculate()

  // const { numberColumn, numberRow } = useCalculate()
  console.log('DraggableManager...')
  return (
    <div ref={ref} className='flex flex-1 overflow-hidden h-screen w-screen absolute left-0 top-0 z-10'>
      <div className={cn('h-full flex items-center relative', className)} {...rest}>
        {pages.map((dapp) => {
          const [left, top] = getPosition(dapp.page, dapp.position)

          return (
            <div
              key={dapp.id}
              datatype='dapp'
              className='z-20 absolute bg-slate-300'
              style={{
                transform: `translate(${left}px, ${top}px)`,
                left: 0,
                top: 0,
                height: itemWidth,
                width: itemWidth
              }}
            >
              dapp
            </div>
          )
        })}
        {pages.map((_page, index) => (
          <div
            key={index}
            style={{ width: window.innerWidth + 'px' }}
            className='h-full shrink-0 flex items-center justify-center border-r border-b border-white/80'
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  )
})
DraggableManager.displayName = 'DraggableManager'
export default React.memo(DraggableManager)
