import React, { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}
const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {
  const { className, ...rest } = props
  console.log('Pagination...')
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-center absolute left-0 right-0 w-full', className)}
      {...rest}
    >
      Pagination
    </div>
  )
})
Pagination.displayName = 'Pagination'
export default React.memo(Pagination)
