import { memo } from "react"
import { Link } from "react-router-dom"

import "./style/aside_rec_title_item.sass"


export const AsideRecTitleItem = memo(({item, imgData, ...props}) => {

    return(
        <li className="rec-title__item" {...props}>
            <Link className="rec-title__link" to={`/anime/${item.alias}`}>
                <img className="rec-title__img" src={imgData} alt="background" />
                <div className="rec-title__inner">
                    <h4>{item.title}</h4>
                    <ul>
                        <li className="point">{item.year}</li>
                        <li className="point">{item.season}</li>
                        <li className="point">{item.type}</li>
                        <li className="point">{item.age_restrict}</li>
                    </ul>
                </div>
            </Link>        
        </li>
    )
})
