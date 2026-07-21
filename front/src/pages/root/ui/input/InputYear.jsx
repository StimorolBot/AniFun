import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputYear = ({ id, errorMsg, register, ...props }) => {
	return (
		<InputDefault
			id={id}
			type="number"
			min={1970}
			max={2050}
			errorMsg={errorMsg}
			{...props}
			register={register("year", {
				valueAsNumber: true,
				min: { value: 1970, message: "От 1970" },
				max: { value: 2050, message: "До 2050" },
			})}
		/>
	)
}
