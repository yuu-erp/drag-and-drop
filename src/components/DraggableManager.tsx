import React, { HTMLAttributes } from 'react'
import useCalculate from '../hooks/useCalculate'
import { useDapp } from '../hooks/useDapp'
import { cn } from '../lib/utils'
import { Pages } from '../types/data'
import DappComponent from './ui/Dapp'

interface DraggableManagerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  pages?: Pages
}
const DraggableManager = React.forwardRef<HTMLDivElement, DraggableManagerProps>((props, ref) => {
  const { pages = [], className, ...rest } = props
  const { getPosition } = useDapp()
  const { itemWidth, itemHeight } = useCalculate()

  console.log('DraggableManager...')
  return (
    <div ref={ref} className='flex flex-1 overflow-hidden h-screen w-screen absolute left-0 top-0 z-10'>
      <div className={cn('h-full flex items-center relative shrink-0', className)} {...rest}>
        {pages.map((dapp, idx) => {
          const [left, top] = getPosition(dapp.page, dapp.position)

          return (
            <DappComponent
              data={dapp}
              key={idx}
              //@ts-ignore
              data-page={dapp.page}
              data-left={left}
              data-top={top}
              style={{
                transform: `translate(${left}px, ${top}px)`,
                left: 0,
                top: 0,
                height: itemHeight,
                width: itemWidth
              }}
            />
          )
        })}
      </div>
    </div>
  )
})
DraggableManager.displayName = 'DraggableManager'
export default React.memo(DraggableManager)
