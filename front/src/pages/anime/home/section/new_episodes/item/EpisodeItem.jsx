import { memo } from "react"
import { Link } from "react-router-dom"

import "./style.sass"


export const EpisodeItem = memo(({item, ...props}) => {
    
    return(
        <li className="episode__item" {...props}>
            <Link to={`/anime/${item.alias}`}>
                <img className="episode__img" src={`data:image/webp;base64,${item.poster}`} alt="new-episode"/>
                <div className="episode__description">
                    <p className="episode__number">
                        {item.episode_number} эпизод
                    </p>
                    <p className="episode__title">
                        {item.title}
                    </p>
                    <ul className="episode__desc-list">
                        <li className="episode__desc-item">
                            {item.year}
                        </li>
                        <li className="episode__desc-item">
                            {item.season}
                        </li>
                        <li className="episode__desc-item">
                            {item.type}
                        </li>
                        <li className="episode__desc-item">
                            {item.age_restrict}
                        </li>
                    </ul>
                    <ul className="episode__desc-list">
                        {item.genres?.slice(-2)?.map((genre, index) => {
                            return(
                                <li className="episode__desc-item episode__desc-item_tag" key={index}>
                                    {genre}
                                </li>
                            )
                        })}
                    </ul>
                    <Link className="episode__link" to={`/anime/episode/${item.uuid_episode}`}>
                        Смотреть
                    </Link>
                </div>
            </Link>
        </li>
    )
})
