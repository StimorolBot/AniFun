import { Link } from "react-router-dom"
import { getPostfix } from "../../../../../../utils/utils"

import "./style.sass"


export function SlideMain({slide}) {
    
    return(
        <div className="slide transition">
            <img className="slide__bg" src={`data:image/webp;base64,${slide.img_rs.banner}`} alt="slide"/>
            <div className="slide__inner">
                <h3 className="slide__title">
                    {slide.title}
                </h3>
                <ul className="slide-desc__list">
                    <li className="slide-desc__item">
                        {slide.season}
                    </li>
                    <li className="slide-desc__item">
                        {slide.year}
                    </li>
                    <li className="slide-desc__item">
                        {slide.total_episode &&
                            `${slide.total_episode} ${getPostfix("эпизод", slide.episode_count)}`
                        }
                    </li>
                    <li className="slide-desc__item">
                        {slide.age_restrict}
                    </li>
                </ul>
                <ul className="slide-desc__list">
                    {slide?.genres_rs?.map((genre, index) => {
                        return(
                            <li className="slide-desc__item slide-desc__item_gray" key={index}>
                                {genre.genres}
                            </li>
                        )
                    })}
                </ul>
                <p className="slide__description">
                    {slide.description}
                </p>
                <Link className="slide-main__link" to={`/anime/${slide.alias}`}>
                    <svg>
                        <use xlinkHref="/main.svg#rectangle-svg"/>
                    </svg> 
                    Смотреть    
                </Link>
            </div>
        </div>
    )
}
