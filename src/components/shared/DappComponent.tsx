import React, { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface DappComponentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  isShowName?: boolean
}
const DappComponent = React.forwardRef<HTMLDivElement, DappComponentProps>((props, ref) => {
  const { className, isShowName = true, ...rest } = props
  return (
    <div ref={ref} className={cn(className)} {...rest}>
      <div className='w-full h-full flex flex-col items-center justify-center gap-1'>
        <div className='w-[60px] aspect-square bg-slate-600 rounded-[14px] shadow-sm'></div>
        {isShowName && <p className='line-clamp-1 text-center text-white font-medium text-xs'>Metanode App</p>}
      </div>
    </div>
  )
})

DappComponent.displayName = 'DappComponent'
export default React.memo(DappComponent)
