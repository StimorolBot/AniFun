import Select from "react-select"

import "./style/custom_select.sass"

export const CustomSelect = ({
	options,
	value,
	className,
	onChange,
	isMulti = false,
	...props
}) => {
	const getValue = () => {
		if (isMulti) return value.label || value
		return value.label || value
	}
	return (
		<Select
			className={className}
			classNamePrefix={className}
			value={getValue()}
			onChange={onChange}
			options={options}
			isMulti={isMulti}
			{...props}
		/>
	)
}
