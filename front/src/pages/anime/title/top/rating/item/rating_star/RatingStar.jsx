import { Star } from "../../../../../../../ui/icon/Star"

import { InputRadio } from "../../../../../../../ui/input/InputRadio"

import "./style.sass"

export const RatingStar = ({ count, myRating, callback }) => {
	return (
		<ul className="rating-title__list">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li key={index} onClick={() => callback(index + 1)}>
							<InputRadio
								id={`rating-title-${index}`}
								text={
									<Star
										className={
											index + 1 <= myRating
												? "rating-star rating-star_active"
												: "rating-star"
										}
									/>
								}
							/>
						</li>
					)
				})}
		</ul>
	)
}
