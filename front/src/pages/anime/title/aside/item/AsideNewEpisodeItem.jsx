import { memo  } from "react"
import { Link } from "react-router-dom"

import "./style/aside_new_episode_item.sass"


export const AsideNewEpisodeItem = memo(({item, imgData, ...props}) => {

    return(
        <li className="aside-ep__item" {...props}>
            <Link className="aside-ep__link" to={`/anime/${item.anime.alias}`}>
                <img className="aside-ep__img" src={imgData} alt="new-episode"/>
                <div className="aside-ep__info">
                    <h4>{item.anime.title}</h4>
                    <p>Эпизод {item.number}</p>
                    <ul className="aside-ep-desc__list">    
                        <li>{item.anime.year}</li>
                        <li>{item.anime.season.label}</li>
                        <li>{item.anime.type.label}</li>
                        <li>{item.anime.age_restrict.label}</li>
                    </ul>
                    <ul className="aside-ep-desc__list">
                        {item.anime.genres?.map((genre, index) => {
                            return <li key={index}>{genre.label}</li>
                        })    
                        }
                    </ul>
                </div>
            </Link>
        </li>
    )
})
