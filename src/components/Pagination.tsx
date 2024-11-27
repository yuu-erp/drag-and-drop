import React, { HTMLAttributes, memo } from 'react'
import { cn } from '../lib/utils'

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({ className, style, ...rest }) => {
  console.log('Pagination...')
  return (
    <div
      className={cn('flex items-center justify-center flex-shrink-0 border-b border-white/80', className)}
      style={style}
      {...rest}
    >
      Pagination
    </div>
  )
}

export default memo(Pagination)
