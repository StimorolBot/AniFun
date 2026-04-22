import { useLayoutEffect, useRef } from "react"

export const useAutoFontSize = ({
	minSize = 16,
	maxSize = 26,
	step = 1,
	deps = [],
}) => {
	const ref = useRef(null)

	useLayoutEffect(() => {
		const el = ref.current
		if (!el) return

		const resize = () => {
			let size = maxSize
			el.style.fontSize = size + "px"

			while (
				(el.scrollHeight > el.offsetHeight ||
					el.scrollWidth > el.offsetWidth) &&
				size > minSize
			) {
				size -= step
				el.style.fontSize = size + "px"
			}
		}

		resize()

		const observer = new ResizeObserver(resize)
		observer.observe(el)

		return () => observer.disconnect()
	}, deps)

	return ref
}
