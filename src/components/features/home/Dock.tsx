import React, { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface DockProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  theme?: 'dark' | 'light'
  styleContainer?: React.CSSProperties // Định nghĩa style
}
const Dock = React.forwardRef<HTMLDivElement, DockProps>((props, ref) => {
  const { className, theme = 'dark', styleContainer, ...rest } = props
  console.log('Dock...')
  return (
    <div ref={ref} className='absolute left-0 right-0 bottom-0 z-10' {...rest}>
      <div className='w-full h-full flex items-center justify-center'>
        <div
          className={cn(
            'h-full w-full backdrop-blur-xl rounded-[40px] flex items-center transition-all duration-300',
            theme === 'dark' ? 'bg-black/20' : 'bg-white/20',
            className
          )}
          style={{ ...styleContainer }}
        >
          {rest.children}
        </div>
      </div>
    </div>
  )
})
Dock.displayName = 'Dock'
export default React.memo(Dock)
