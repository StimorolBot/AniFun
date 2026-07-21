import { InputDefault } from "../../../../ui/input/InputDefault"

export const InputEpisode = ({
	id,
	errorMsg,
	register,
	param = "total_episode",
	...props
}) => {
	return (
		<InputDefault
			id={id}
			type="number"
			min={1}
			max={1000}
			{...props}
			errorMsg={errorMsg}
			register={register(param, {
				valueAsNumber: true,
				min: { value: 1, message: "От 1" },
				max: { value: 1000, message: "До 1000" },
			})}
		/>
	)
}
