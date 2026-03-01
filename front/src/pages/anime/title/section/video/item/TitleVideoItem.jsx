import { memo } from "react"
import { Link } from "react-router-dom"

import "./style.sass"


export const TitleVideoItem = memo(({item, imgData, ...props}) => {

    return(
        <li className="title-video__item" {...props}>
            <Link className="title-video__link" to={`/anime/video/episode/${item.uuid}`}>
                <img className="title-video__preview" src={imgData} alt="preview" />
                <div className="title-video__container">
                    <p className="title-video__name">
                        {item?.name}
                    </p>
                    <p  className="title-video__episode-number">
                        {item.number} эпизод
                    </p>
                </div>
            </Link>                
        </li>
    )
})
