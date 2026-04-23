import { memo } from "react"

import "./style/input_search.sass"

export const InputSearch = memo(({ id, register, errorMsg, ...props }) => {
	return (
		<div className="input-search__container">
			<input
				className="input-search"
				id={id}
				type="search"
				minLength={5}
				maxLength={150}
				{...props}
				{...register("title", {
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
			<label className="input-search__label" htmlFor={id}>
				{errorMsg}
			</label>
		</div>
	)
})
