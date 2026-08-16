import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"

import "./style/switch_day.sass"

export const SwitchDay = ({ value, setValue, ...props }) => {
	return (
		<div className="switch-day__container" {...props}>
			<BtnDefault
				callback={() => setValue("today")}
				data-day-active={value === "today" && "today"}
			>
				Сегодня
			</BtnDefault>
			<BtnDefault
				callback={() => setValue("tomorrow")}
				data-day-active={value === "tomorrow" && "tomorrow"}
			>
				Завтра
			</BtnDefault>
		</div>
	)
}
