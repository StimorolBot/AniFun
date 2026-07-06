import "./style/input_radio.sass"

export const InputRadio = ({ id, callback, text, ...props }) => {
	return (
		<div className="input-radio__container">
			<input
				className="input-radio"
				id={id}
				type="radio"
				onChange={(e) => callback(e)}
				{...props}
			/>
			<label className="input-radio__label" htmlFor={id}>
				{text}
			</label>
		</div>
	)
}
