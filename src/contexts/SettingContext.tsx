import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export interface ISettingContext {
  setIsLoadingSetting: React.Dispatch<React.SetStateAction<boolean>>
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  isLoadingSetting: boolean
  isEdit: boolean
  currentPage: React.MutableRefObject<number>
  setCurrentPage: (page: number) => void
}

interface SettingProviderProps extends PropsWithChildren {}

export const SettingContext = React.createContext<ISettingContext>(null!)

export const SettingProvider: React.FC<SettingProviderProps> = ({ children }) => {
  const [isLoadingSetting, setIsLoadingSetting] = useState(false)
  const [isEdit, setIsEdit] = useLocalStorage<boolean>('isEdit', false)
  // Lấy giá trị currentPage từ localStorage hoặc mặc định là 0
  const currentPage = useRef<number>(parseInt(localStorage.getItem('currentPage') || '0', 10))
  // Hàm cập nhật currentPage và đồng bộ với localStorage
  const setCurrentPage = (page: number) => {
    currentPage.current = page
    localStorage.setItem('currentPage', page.toString())
  }
  useEffect(() => {
    const savedPage = parseInt(localStorage.getItem('currentPage') || '0', 10)
    if (!isNaN(savedPage)) {
      currentPage.current = savedPage
    }
  }, [])

  return (
    <SettingContext.Provider
      value={{
        setIsLoadingSetting,
        isLoadingSetting,
        isEdit,
        setIsEdit,
        currentPage,
        setCurrentPage
      }}
    >
      {children}
    </SettingContext.Provider>
  )
}
