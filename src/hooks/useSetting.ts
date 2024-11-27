import { useContext } from 'react'
import { ISettingContext, SettingContext } from '../contexts'

export default function useSetting() {
  const contexts = useContext<ISettingContext>(SettingContext)
  if (!contexts) throw new Error('useSetting must be used within a SettingProvider')
  return contexts
}
