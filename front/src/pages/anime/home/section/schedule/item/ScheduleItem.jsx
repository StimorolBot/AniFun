import { Link } from "react-router-dom"

import "./style.sass"


export const ScheduleItem = ({item,  imgData, ...props}) => {

    return(
        <li className="schedule__item" {...props}>
            <Link className="schedule__link" to={`/anime/${item.anime.alias}`}>  
                <img className="schedule__bg" src={imgData} loading="lazy" alt="preview" />
                <p className="schedule__title">
                    {item.anime.title}
                </p>
                <p className="schedule__episode">
                    {`${item.episode_number} ${"Эпизод"}`}
                </p>
                <ul className="schedule__desc-list">
                    <li className="schedule__desc-item point">
                        {item?.anime.season.label}
                    </li>
                    <li className="schedule__desc-item point">
                        {item?.anime.year}
                    </li>
                     <li className="schedule__desc-item point">
                        {item?.anime.age_restrict.label}
                    </li>
                    <li className="schedule__desc-item point">
                        {item?.anime.type.label}
                    </li>
                </ul>
                <ul className="schedule__desc-list">
                    {item?.anime.genres?.slice(-2)?.map((genre, index) => {
                        return(
                            <li className="schedule__desc-item point" key={index}>
                                {genre.label}
                            </li>
                        )
                    })}
                </ul>
            </Link>
        </li>
    )
}
