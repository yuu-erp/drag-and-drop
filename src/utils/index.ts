export const logEvent = (action: string, event: Event, clientCoordinates: { clientX: number; clientY: number }) => {
  console.log(`${action} - event: `, event)
  console.log(`${action} - coordinates: `, clientCoordinates)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
