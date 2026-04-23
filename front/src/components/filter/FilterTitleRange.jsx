import { memo } from "react"
import { Controller } from "react-hook-form"
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"

import "./style/double_input.sass"

export const FilterTitleRange = memo(({ control }) => {
	return (
		<div className="double-input__container">
			<Controller
				name="year"
				control={control}
				render={({ field }) => {
					return (
						<>
							<span>{field.value[0]}</span>
							<RangeSlider
								className="double-input"
								id="double-input"
								min={1970}
								max={2050}
								step={1}
								value={field.value}
								onInput={(val) => {
									field.onChange(val)
								}}
							/>
							<span>{field.value[1]}</span>
						</>
					)
				}}
			/>
		</div>
	)
})
