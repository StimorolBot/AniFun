import { memo } from "react"
import { Link } from "react-router-dom"

import "./style.sass"


export const ReleaseItem = memo(({item}) => {

    return(
        <li className="release__item">
           <div className="release__img-container">
                <img src={`data:image/webp;base64,${item?.img_rs?.poster}`} alt="poster"/>
            </div>
            <div className="release__item-info">
                <h3>
                    {item?.title}
                </h3>
                <div className="release__item-container">
                    <ul className="release__desc-list">
                        {item?.genres_rs?.map((genre, index) => {
                            return(
                                <li key={index}>
                                    <Link className="release_genre-link" to={`/anime/genres/${genre.genres}`}>
                                        {genre.genres}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <ul className="release__desc-list">
                        <li>{item?.year}</li>
                        <li>{item?.season}</li>
                        <li>{item?.type}</li>
                        <li>{item?.age_restrict}</li>
                    </ul>
                </div>
                <p className="release__item-description">
                    {item?.description}
                </p>
                <div className="release__link-container">
                    <Link to={`/anime/${item?.alias}`}>
                        Смотреть
                    </Link>
                </div>  
            </div>
        </li>
    )
})
