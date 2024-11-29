import React, { HTMLAttributes } from 'react'
import { cn } from '../lib/utils'
import { Pages } from '../types/data'
import useCalculate from '../hooks/useCalculate'
import { createGrid } from '../utils/math'

interface DraggableManagerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  pages?: Pages[]
}
const DraggableManager = React.forwardRef<HTMLDivElement, DraggableManagerProps>((props, ref) => {
  const { pages = [], className, ...rest } = props
  const { numberColumn, numberRow } = useCalculate()
  console.log('DraggableManager...')
  return (
    <div ref={ref} className='flex flex-1 overflow-hidden'>
      <div className={cn('h-full flex items-center', className)} {...rest}>
        {createGrid(numberRow, numberColumn).map((_page, index) => (
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
