import "./style/input_checkbox.sass"

export const InputCheckbox = ({
	id,
	register,
	param,
	size = "small",
	...props
}) => {
	return (
		<div className="input-checkbox__container" data-size={size}>
			<input
				className="input-checkbox"
				id={id}
				type="checkbox"
				{...register(param)}
				{...props}
			/>
			<label
				className="input-checkbox__label"
				htmlFor={id}
				data-size={size}
			/>
		</div>
	)
}
