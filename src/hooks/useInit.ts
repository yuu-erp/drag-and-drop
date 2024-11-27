import useCalculate from './useCalculate'
import useDappManager from './useDappManager'
import useDraggable from './useDraggable'
import useSetting from './useSetting'

export default function useInit() {
  const setting = useSetting()
  const calculate = useCalculate()
  const dappManager = useDappManager()
  const draggable = useDraggable()
  return {
    ...setting,
    ...calculate,
    ...draggable,
    ...dappManager
  }
}
