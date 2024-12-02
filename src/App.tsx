import { SettingProvider } from './contexts'
import { CalculateProvider } from './contexts/CalculateContext2'
import MainLayout from './layouts/MainLayout2'
import NewLayout from './layouts/NewLayout'

export default function App() {
  return (
    <SettingProvider>
      <CalculateProvider>
        {/* <NewLayout /> */}
        <MainLayout />
      </CalculateProvider>
    </SettingProvider>
  )
}
