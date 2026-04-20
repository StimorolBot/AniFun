import { memo } from "react"

import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputAlias = memo(({ id, errorMsg, register, ...props }) => {
	return (
		<InputDefault
			id={id}
			minLength={5}
			maxLength={150}
			placeholder="Alias"
			defaultValue={null}
			{...props}
			errorMsg={errorMsg}
			register={register("alias", {
				defaultValue: null,
				minLength: { value: 5, message: "Alias от 5 символов" },
				maxLength: { value: 150, message: "Alias до 150 символов" },
				pattern: {
					value: /(^[a-zA-Z0-9][a-zA-Z0-9_-]*$)/,
					message: "Некорректный alias",
				},
			})}
		/>
	)
})
