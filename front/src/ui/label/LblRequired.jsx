import "./style/lbl_required.sass"

export const LblRequired = ({
	htmlFor,
	children,
	isRequired = false,
	...props
}) => {
	return (
		<label
			className="required-lbl"
			htmlFor={htmlFor}
			data-required={isRequired}
			{...props}
		>
			{children}
		</label>
	)
}
