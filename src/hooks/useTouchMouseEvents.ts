export const getEventTypes = (isTouch: boolean) => {
  return isTouch
    ? { start: 'touchstart', move: 'touchmove', end: 'touchend' }
    : { start: 'mousedown', move: 'mousemove', end: 'mouseup' }
}

export const getClientCoordinates = (event: TouchEvent | MouseEvent): { clientX: number; clientY: number } => {
  if (event instanceof TouchEvent) {
    const touch = event.changedTouches[0]
    return { clientX: touch.clientX, clientY: touch.clientY }
  }
  if (event instanceof MouseEvent) {
    return { clientX: event.clientX, clientY: event.clientY }
  }
  return { clientX: 0, clientY: 0 }
}
