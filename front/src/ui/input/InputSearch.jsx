import { memo } from "react"

import "./style/input_search.sass"

export const InputSearch = memo(({ setVal, val, ...props }) => {
	return (
		<input
			className="input-search"
			id="input-search"
			type="search"
			onChange={setVal}
			value={val}
			{...props}
		/>
	)
})
