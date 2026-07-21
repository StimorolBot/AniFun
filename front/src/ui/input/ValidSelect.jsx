import { Controller } from "react-hook-form"

import { CustomSelect } from "./CustomSelect"

export const ValidSelect = ({
	options,
	name,
	control,
	className = "custom-select",
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const handleChange = (selected) => {
					field.onChange(selected ? selected.value : "")
				}

				const selectedValue =
					options.find((v) => v.value === field.value) || null

				return (
					<CustomSelect
						options={options}
						value={selectedValue}
						onChange={handleChange}
						className={className}
						{...props}
					/>
				)
			}}
		/>
	)
}
