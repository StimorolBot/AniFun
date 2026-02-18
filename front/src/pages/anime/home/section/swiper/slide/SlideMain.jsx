import { Link } from "react-router-dom"
import { getPostfix } from "../../../../../../utils/utils"

import "./style.sass"


export function SlideMain({item, urlIMg}) {

    return(
        <div className="slide transition">
            <img className="slide__bg" src={urlIMg} />
            {item?.avg &&
                <div className="slide__inner-rating">
                <div/>
                <p>{item.avg}</p>
            </div>
            }
            <div className="slide__inner">
                <h3 className="slide__title">
                    {item.anime.title}
                </h3>
                <ul className="slide-desc__list">
                    <li className="slide-desc__item">
                        <Link className="slide__link" to={`/anime`} state={item.anime.season.value}>
                            {item.anime.season.label}
                        </Link>
                    </li>
                    <li className="slide-desc__item">
                        <Link className="slide__link" to={`/anime`} state={item.anime.year}>
                            {item.anime.year}
                        </Link>
                    </li>
                    <li className="slide-desc__item">
                        {item.anime.total_episode &&
                            `${item.anime.total_episode} ${getPostfix("эпизод", item.anime.episode_count)}`
                        }
                    </li>
                    <li className="slide-desc__item">
                        <Link className="slide__link" to={`/anime`} state={item.anime.age_restrict.value}>
                            {item.anime.age_restrict.label}
                        </Link>
                    </li>
                </ul>
                <ul className="slide-desc__list">
                    {item?.anime.genres?.map((genre, index) => {
                        return(
                            <li className="slide-desc__item slide-desc__item_gray" key={index}>
                                <Link className="slide__link" to={`anime/genres/${genre.value}`}>
                                    {genre.label}                            
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <p className="slide__description">
                    {item.anime.description}
                </p>
                <Link className="slide-main__link" to={`/anime/${item.alias}`}>
                    <svg>
                        <use xlinkHref="/main.svg#rectangle-svg"/>
                    </svg> 
                    Смотреть    
                </Link>
            </div>
        </div>
    )
}
