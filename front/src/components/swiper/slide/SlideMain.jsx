import { getPostfix } from "../../../utils/getPostfix"
import { LinkWatch } from "../../../ui/link/LinkWatch"

import "./style/slide_main.sass"


export function SlideMain({slide}) {

    return(
        <div className="slide">
            <img className="slide__bg" src={`data:image/webp;base64,${slide["img_rs"]["banner"]}`} alt="slide"/>
            <div className="slide__inner">
                <h3 className="slide__title">
                    {slide["title"]}
                </h3>
                <ul className="slide-desc__list">
                    <li className="slide-desc__item">
                        {slide["season"]}
                    </li>
                    <li className="slide-desc__item">
                        {slide["year"]}
                    </li>
                    <li className="slide-desc__item">
                        {`${slide["episodes"]} ${getPostfix("эпизод", slide["episodes"])}`} 
                    </li>
                    <li className="slide-desc__item">
                        {slide["age_restrict"]}
                    </li>
                </ul>
                <ul className="slide-desc__list">
                    {slide["genres_rs"]?.map((genre, index) => {
                        return(
                            <li className="slide-desc__item slide-desc__item_gray" key={index}>
                                {genre["genres"]}
                            </li>
                        )
                    })}
                </ul>
                <p className="slide__description">
                    {slide["description"]}
                </p>
                <LinkWatch/>
            </div>
        </div>
    )
}