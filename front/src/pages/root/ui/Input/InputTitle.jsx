import { memo } from "react"

import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputTitle = memo(
	({ id, errorMsg, register, param, ...props }) => {
		return (
			<InputDefault
				id={id}
				minLength={5}
				maxLength={150}
				{...props}
				errorMsg={errorMsg}
				register={register(param, {
					minLength: { value: 5, message: "Название от 5 символов" },
					maxLength: {
						value: 150,
						message: "Название до 150 символов",
					},
					pattern: {
						value: /(^[a-zA-Zа-яёА-ЯЁ0-9][a-zA-Zа-яёА-ЯЁ0-9\s]*$)/,
						message: "Некорректное название",
					},
				})}
			/>
		)
	},
)
