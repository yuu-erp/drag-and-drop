/**
 * Truy vấn phần tử đầu tiên trong DOM khớp với selector.
 * @param {string} selector - Selector CSS được sử dụng để tìm kiếm phần tử.
 * @returns {HTMLElement | null} - Phần tử đầu tiên khớp với selector hoặc `null` nếu không tìm thấy.
 */
export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector)
}
/**
 * Truy vấn tất cả các phần tử trong DOM khớp với selector.
 *
 * @param {string} selector - Selector CSS được sử dụng để tìm kiếm các phần tử.
 * @returns {HTMLElement[]} - Một mảng các phần tử khớp với selector.
 */
export function queryAll(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector))
}
/**
 * Thêm một hoặc nhiều class vào phần tử.
 * @param {HTMLElement} el - Phần tử cần thêm class.
 * @param {string} className - Class hoặc các class cách nhau bằng khoảng trắng.
 */
export function addClass(el: HTMLElement, className: string): void {
  el.classList.add(className)
}
