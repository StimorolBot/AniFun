import "./style/input_default.sass"

export const InputDefault = ({ id, register, errorMsg, ...props }) => {
	return (
		<div className="input-default__container">
			<input className="input-default" id={id} {...props} {...register} />
			<span className="input-default__error">{errorMsg}</span>
		</div>
	)
}
