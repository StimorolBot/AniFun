import { forwardRef, useEffect, useRef } from "react"

import "./style/textarea_default.sass"

export const TextareaDefault = forwardRef(
	(
		{ id, placeholder, register, errorMsg, countLineBreak = 4, ...props },
		forwardedRef,
	) => {
		const textareaRef = useRef(null)

		const {
			onChange: registerOnChange,
			ref: registerRef,
			name: registerName,
			...restRegister
		} = register || {}

		const resizeTextarea = () => {
			if (!textareaRef.current) return
			textareaRef.current.style.height = "20px"
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}

		const setRef = (ref, node) => {
			if (!ref) return
			if (typeof ref === "function") ref(node)
			else ref.current = node
		}

		const bindRefs = (node) => {
			textareaRef.current = node
			setRef(registerRef, node)
			setRef(forwardedRef, node)
		}

		const handleChange = (event) => {
			const nextValue = event.target.value

			if (nextValue.split("\n").length > countLineBreak) return

			registerOnChange?.(event)

			resizeTextarea()
		}

		useEffect(() => {
			resizeTextarea()
		}, [])

		return (
			<div className="textarea-default__inner">
				<textarea
					className="textarea-default"
					id={id}
					name={registerName}
					ref={bindRefs}
					placeholder={placeholder}
					onChange={handleChange}
					{...restRegister}
					{...props}
				/>
				<span className="input-default__error">{errorMsg}</span>
			</div>
		)
	},
)
