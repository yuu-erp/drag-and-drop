import React, { HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface DockProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}
const Dock = React.forwardRef<HTMLDivElement, DockProps>((props, ref) => {
  const { className, ...rest } = props
  console.log('Dock...')
  return (
    <div ref={ref} className={cn('flex items-center justify-center flex-shrink-0', className)} {...rest}>
      Dock
    </div>
  )
})
Dock.displayName = 'Dock'
export default React.memo(Dock)
