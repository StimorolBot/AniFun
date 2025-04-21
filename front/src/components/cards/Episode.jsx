import { memo } from "react"
import { LinkWatch } from "../../ui/link/LinkWatch"
import { BtnAddQueue } from "../../ui/btn/BtnAddQueue"

import "./style/episode.sass"


export const Episode = memo(({episode}) => {

    const data = episode["episode_data"]["anime_data"]

    return(
        <li className="episode__item" key={data["uuid"]}>
            <img className="episode__img" src={`data:image/webp;base64,${episode["poster"]}`} alt="new-episode"/>
            <div className="episode__description">
                <p className="episode__number">
                    {episode["episode_data"]["number"]} эпизод
                </p>
                <p className="episode__title">
                    {data["title"]}
                </p>
                <ul className="episode__desc-list">
                    <li className="episode__desc-item">
                        {data["year"]}
                    </li>
                    <li className="episode__desc-item">
                        {data["season"]}
                    </li>
                    <li className="episode__desc-item">
                        {data["type"]}
                    </li>
                    <li className="episode__desc-item">
                        {data["age_restrict"]}
                    </li>
                </ul>
                <ul className="episode__desc-list">
                    {episode["genres"]?.slice(-2)?.map((genre, index) => {
                        return(
                            <li className="episode__desc-item episode__desc-item_tag" key={index}>
                                {genre}
                            </li>
                        )
                    })}
                </ul>
                <div className="episode-btn__container">
                    <LinkWatch/>
                    <BtnAddQueue/>
                </div>
            </div>
        </li>
    )
})