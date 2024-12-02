import React, { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}
const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>((props, ref) => {
  const { className, ...rest } = props
  console.log('StatusBar...')
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-center absolute top-0 left-0 right-0 z-10', className)}
      {...rest}
    >
      StatusBar
    </div>
  )
})
StatusBar.displayName = 'StatusBar'
export default React.memo(StatusBar)
