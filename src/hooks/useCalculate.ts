import { useContext } from 'react'
import { CalculateContext, ICalculateContext } from '../contexts'

export default function useCalculate() {
  const contexts = useContext<ICalculateContext>(CalculateContext)
  console.log('useCalculate', contexts)
  if (!contexts) throw new Error('useSetting must be used within a SettingProvider')
  return contexts
}
