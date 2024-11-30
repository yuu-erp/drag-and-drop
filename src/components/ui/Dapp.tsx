import React, { HTMLAttributes, memo } from 'react'
import { Dapp } from '../../types/data'
import { SIZE_ICON_APP } from '../../constant'

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Dapp
}

const DappComponent = memo((props: Props) => {
  const { data, ...rest } = props

  return (
    <div className='z-20 absolute ' {...rest}>
      <div className='size-full relative flex flex-col justify-between'>
        {/* <img src={data.logo} className='w-full aspect-square bg-slate-300' /> */}
        <div
          datatype='dapp'
          className='bg-slate-50 shrink-0'
          style={{
            height: SIZE_ICON_APP,
            width: SIZE_ICON_APP
          }}
        />
        <p className='text-xs line-clamp-1 text-center'>{data.name}</p>
      </div>
    </div>
  )
})

export default DappComponent
