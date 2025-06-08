import { memo } from "react"
import { LinkWatch } from "../../ui/link/LinkWatch"
import { BtnAddQueue } from "../../ui/btn/BtnAddQueue"

import "./style/episode_item.sass"


export const EpisodeItem = memo(({item, ...props}) => {
    const data = item?.episode_data?.anime_data

    return(
        <li className="episode__item" {...props}>
            <img className="episode__img" src={`data:image/webp;base64,${item["poster"]}`} alt="new-episode"/>
            <div className="episode__description">
                <p className="episode__number">
                    {item?.episode_data?.schedule_rs?.episode_number} эпизод
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
                    {item["genres"]?.slice(-2)?.map((genre, index) => {
                        return(
                            <li className="episode__desc-item episode__desc-item_tag" key={index}>
                                {genre}
                            </li>
                        )
                    })}
                </ul>
                <div className="episode-btn__container">
                    <LinkWatch alias={`/anime/releases/release/${data["alias"]}/episodes`}/>
                    <BtnAddQueue/>
                </div>
            </div>
        </li>
    )
})