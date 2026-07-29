import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputTitle = ({
	id,
	errorMsg,
	register,
	param,
	isLoading,
	...props
}) => {
	return (
		<InputDefault
			id={id}
			minLength={5}
			maxLength={150}
			isLoading={isLoading}
			{...props}
			errorMsg={errorMsg}
			register={register(param, {
				minLength: { value: 5, message: "Название от 5 символов" },
				maxLength: {
					value: 150,
					message: "Название до 150 символов",
				},
				pattern: {
					value: /^[\p{L}\p{N}][\p{L}\p{N}\p{M} .,'":;!?()&+\-/☆★×ー・―]*$/u,
					message: "Некорректное название",
				},
			})}
		/>
	)
}
