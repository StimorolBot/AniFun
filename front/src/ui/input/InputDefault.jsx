import { Loader } from "../../components/loader/Loader"

import "./style/input_default.sass"

export const InputDefault = ({
	id,
	register,
	errorMsg,
	isLoading,
	...props
}) => {
	return (
		<div className="input-default__container">
			<input
				className="input-default"
				id={id}
				disabled={isLoading}
				{...props}
				{...register}
			/>
			{isLoading && (
				<div className="input-default__loader">
					<Loader size="small" />
				</div>
			)}
			<span className="input-default__error">{errorMsg}</span>
		</div>
	)
}
