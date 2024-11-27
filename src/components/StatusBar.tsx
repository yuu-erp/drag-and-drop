import React, { HTMLAttributes, memo } from 'react'
import { cn } from '../lib/utils'

interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

const StatusBar: React.FC<StatusBarProps> = ({ className, style, ...rest }) => {
  console.log('StatusBar...')
  return (
    <div
      className={cn('flex items-center justify-center flex-shrink-0 border-b border-white/80', className)}
      style={style}
      {...rest}
    >
      StatusBar
    </div>
  )
}

export default memo(StatusBar)
