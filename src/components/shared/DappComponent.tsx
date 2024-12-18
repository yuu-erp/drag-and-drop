import React, { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { SIZE_ICON } from '../../constant2'

interface DappComponentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  isShowName?: boolean
}
const DappComponent = React.forwardRef<HTMLDivElement, DappComponentProps>((props, ref) => {
  const { className, isShowName = true, ...rest } = props
  return (
    <div ref={ref} className={cn(className)} {...rest}>
      <div className='w-full h-full flex flex-col items-center justify-center gap-1'>
        <div
          datatype='dapp'
          className='w-[60px] aspect-square bg-slate-600 rounded-[14px] shadow-sm'
          style={{
            width: SIZE_ICON + 'px',
            height: SIZE_ICON + 'px'
          }}
        ></div>
        {isShowName && <p className='line-clamp-1 text-center text-white font-medium text-xs'>Metanode App</p>}
      </div>
    </div>
  )
})

DappComponent.displayName = 'DappComponent'
export default React.memo(DappComponent)
