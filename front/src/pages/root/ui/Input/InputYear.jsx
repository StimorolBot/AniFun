import { memo } from "react"

import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputYear = memo(({ id, errorMsg, register, ...props }) => {
	return (
		<InputDefault
			id={id}
			type="number"
			placeholder="Год"
			{...props}
			min={1970}
			max={2050}
			errorMsg={errorMsg}
			register={register("year", {
				valueAsNumber: true,
				min: { value: 1970, message: "От 1970" },
				max: { value: 2050, message: "До 2050" },
			})}
		/>
	)
})
