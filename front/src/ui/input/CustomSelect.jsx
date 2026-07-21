import Select from "react-select"

import "./style/custom_select.sass"

export const CustomSelect = ({
	options,
	value,
	className,
	onChange,
	...props
}) => {
	return (
		<Select
			className={className}
			classNamePrefix={className}
			value={value}
			onChange={onChange}
			options={options}
			{...props}
		/>
	)
}
