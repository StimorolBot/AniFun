import { memo } from "react"

import "./style/btn_default.sass"

export const BtnDefault = memo(
	({ children, callback, isStroke = true, ...props }) => {
		return (
			<button
				className="btn-default"
				data-stroke={isStroke}
				onClick={callback}
				{...props}
			>
				{children}
			</button>
		)
	},
)
