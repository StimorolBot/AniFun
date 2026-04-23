import { memo } from "react"

import "./style/filter_title.sass"

export const FilterTitle = memo(({ filterList, register, keyFilter }) => {
	return (
		<ul className="filter-title__list">
			{filterList?.map((item, index) => {
				return (
					<li className="filter-title__item" key={index}>
						<input
							id={`filter-type-${item}`}
							type="checkbox"
							value={item}
							name="filter-title"
							{...register(keyFilter)}
						/>
						<label htmlFor={`filter-type-${item}`}>{item}</label>
					</li>
				)
			})}
		</ul>
	)
})
