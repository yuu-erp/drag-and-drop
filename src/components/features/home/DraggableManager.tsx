import React, { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface DraggableManagerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  isBlur?: boolean
  theme?: 'dark' | 'light'
  isBgScroll?: boolean
}

const DraggableManager = React.forwardRef<HTMLDivElement, DraggableManagerProps>((props, ref) => {
  const { className, isBlur = false, theme = 'dark', isBgScroll = true, ...rest } = props
  return (
    <div ref={ref} className={cn('absolute inset-0 h-full w-full overflow-hidden', className)}>
      <div
        className='relative h-full w-full flex items-center'
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/14/a8/e0/14a8e061fa17ed31521f19998c82720d.jpg')`,
          backgroundRepeat: isBgScroll ? 'repeat-x' : 'no-repeat',
          backgroundSize: isBgScroll ? 'auto 100%' : 'cover',
          ...rest.style
        }}
      >
        {isBlur && (
          <div className={cn('absolute inset-0 backdrop-blur', theme === 'dark' ? 'bg-black/20' : 'bg-white/20')} />
        )}
        {rest.children}
      </div>
    </div>
  )
})

DraggableManager.displayName = 'DraggableManager'
export default React.memo(DraggableManager)
