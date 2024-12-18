export type DappPosition = {
  x: number
  y: number
  width: number
  height: number
}
export type Dapp = {
  name: string
  id: number
  page: number
  position: DappPosition
  logo: string
}

export type Pages = Dapp[]
