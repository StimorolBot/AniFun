import { useState } from "react"

import "./style/btn_burger.sass"

export const BtnBurger = ({ state, callback }) => {
	return (
		<button
			className={state ? "btn-burger btn-burger_active" : "btn-burger"}
			onClick={callback}
		>
			<span />
			<span />
			<span />
		</button>
	)
}
