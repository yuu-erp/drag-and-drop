import { SettingProvider, CalculateProvider } from './contexts'
import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <SettingProvider>
      <CalculateProvider>
        <MainLayout />
      </CalculateProvider>
    </SettingProvider>
  )
}
