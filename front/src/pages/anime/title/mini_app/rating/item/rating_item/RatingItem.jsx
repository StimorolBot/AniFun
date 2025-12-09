import { Fragment, memo } from "react"

import "./style.sass"


export const RatingItem = memo(({myRating, starsList, requestRating}) => {

    return(<>{
        starsList.map(index => {
            return(
                <Fragment key={index}>
                    <input 
                        className={myRating === index ? "rating-input rating-input_check" : "rating-input"}
                        id={`rating-star${index}`} 
                        type="radio"
                        name="rating"
                        value={index}
                        onClick={async e => await requestRating(e.target.value)}
                    />
                    <label
                        className="rating-lbl" 
                        htmlFor={`rating-star${index}`} 
                        title={index}
                    >
                        <svg className="rating-star__svg">
                            <use xlinkHref="/main.svg#star-svg"/>
                        </svg>
                    </label>
                </Fragment>
            )})
        }
    </>)
})
