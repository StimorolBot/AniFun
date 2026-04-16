import { memo } from "react"

import { TextareaDefault } from "./TextareaDefault"

export const TextareaValidate = memo(
	({
		id,
		countLineBreak,
		setValue,
		value,
		errorMsg,
		register,
		param,
		...props
	}) => {
		return (
			<TextareaDefault
				id={id}
				minLength={10}
				maxLength={1000}
				countLineBreak={countLineBreak}
				setValue={setValue}
				value={value}
				errorMsg={errorMsg}
				{...props}
				register={register(param, {
					minLength: { value: 10, message: "От 10" },
					maxLength: { value: 1000, message: "До 1000" },
					pattern: {
						value: /(^[^\s\\$|*/@`%&#]([\s\S]*[^\s\\$|*/@`%&#])?$)/,
						message: "Некорректное содержание",
					},
				})}
			/>
		)
	},
)
