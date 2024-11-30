export const logEvent = (action: string, event: Event, clientCoordinates: { clientX: number; clientY: number }) => {
  console.log(`${action} - event: `, event)
  console.log(`${action} - coordinates: `, clientCoordinates)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const animate = (fn: (progress: number) => void, duration = 100, cb?: () => void) => {
  let startTime: number | null = null

  const run = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const elapsed = currentTime - startTime

    const progress = Math.min(elapsed / duration, 1)
    fn(progress)
    if (progress < 1) {
      requestAnimationFrame(run)
      return
    }
    cb?.()
  }
  requestAnimationFrame(run)
}

export function getTranslateFromTransform(element: HTMLElement): { left: number; top: number } {
  // Get the transform string from the inline style or computed style
  const transform = element.style.transform || window.getComputedStyle(element).transform

  const failed = { left: 0, top: 0 }

  if (!transform || transform === 'none') return failed // Return failed if no transform is found

  // Use a regular expression to extract the translate part
  const translateMatch = transform.match(/translate\((-?\d+\.?\d*)px?,\s*(-?\d+\.?\d*)px?\)/)

  if (translateMatch) {
    // Return the x and y values as numbers
    const left = parseFloat(translateMatch[1])
    const top = parseFloat(translateMatch[2])
    return { left, top } // Return the x and y values as an object
  }

  return failed // Return failed if no translate match is found
}
