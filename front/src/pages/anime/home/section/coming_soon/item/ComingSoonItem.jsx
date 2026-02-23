import { Link } from "react-router-dom"

import "./style.sass"


export const ComingSoonItem = ({item,  imgData, ...props}) => {

    return(
        <li className="coming-soon__item" {...props}>
            <Link className="coming-soon__link" to={`/anime/${item.anime.alias}`}>  
                <img className="coming-soon__bg" src={imgData} loading="lazy" alt="preview" />
                <p className="coming-soon__title">
                    {item.anime.title}
                </p>
                <p className="coming-soon__episode">
                    {`${item.episode_number} ${"Эпизод"}`}
                </p>
                <ul className="coming-soon__desc-list">
                    <li className="coming-soon__desc-item">
                        {item?.anime.season.label}
                    </li>
                    <li className="coming-soon__desc-item">
                        {item?.anime.year}
                    </li>
                     <li className="coming-soon__desc-item">
                        {item?.anime.age_restrict.label}
                    </li>
                    <li className="coming-soon__desc-item">
                        {item?.anime.type.label}
                    </li>
                </ul>
                <ul className="coming-soon__desc-list">
                    {item?.anime.genres?.slice(-2)?.map((genre, index) => {
                        return(
                            <li className="coming-soon__desc-item" key={index}>
                                {genre.label}
                            </li>
                        )
                    })}
                </ul>
            </Link>
        </li>
    )
}
