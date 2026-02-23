import { memo } from "react"
import { Link } from "react-router-dom"

import "./style.sass"


export const EpisodeItem = memo(({item, imgData, ...props}) => {

    return(
        <li className="episode__item" {...props}>
            <img className="episode__img" src={imgData} loading="lazy" alt="poster" />
            <div className="episode__description">
                <p className="episode__number">
                    {item.number} эпизод
                </p>
                <Link className="episode__title" to={`/anime/${item.anime.alias}`}>
                    {item.anime.title}
                </Link>
                <ul className="episode__desc-list">
                    <li className="episode__desc-item">
                        <Link to={`/anime`} state={item.anime.year}>
                            {item.anime.year}
                        </Link>
                    </li>
                    <li className="episode__desc-item">
                        <Link to={`/anime`} state={item.anime.season.value}>
                            {item.anime.season.label}
                        </Link>
                    </li>
                    <li className="episode__desc-item">
                        <Link to={`/anime`} state={item.anime.type.value}>
                            {item.anime.type.label}
                        </Link>
                    </li>
                    <li className="episode__desc-item">
                        <Link to={`/anime`} state={item.anime.age_restrict.value}>
                            {item.anime.age_restrict.label}
                        </Link>
                    </li>
                </ul>
                <ul className="episode__desc-list">
                    {item.anime.genres?.slice(-3)?.map((genre, index) => {
                        return(
                            <li className="episode__desc-item episode__desc-item_tag" key={index}>
                                <Link to={`anime/genres/${genre.value}`}>
                                    {genre.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <Link className="episode__link" to={`anime/${item.anime.alias}/episode/${item.uuid_episode}`}>
                    Смотреть
                </Link>
            </div>
        </li>
    )
})
