import { SettingProvider } from './contexts'
import NewLayout from './layouts/NewLayout'

export default function App() {
  return (
    <SettingProvider>
      {/* <CalculateProvider> */}
      <NewLayout />
      {/* </CalculateProvider> */}
    </SettingProvider>
  )
}
