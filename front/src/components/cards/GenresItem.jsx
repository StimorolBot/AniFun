import { memo } from "react"
import { Link } from "react-router-dom"

import { getPostfix } from "../../utils/getPostfix"

import "./style/genres_item.sass"


export const GenresItem = memo(({item, ...props}) => {
    
    return(
        <li className="genres__item" {...props}>
            <Link className="genres__item-link" to={`anime/genres/${item["alias"]}`}>
                <div className="genres__bg-container">
                    <img className="genres__bg" src={`data:image/webp;base64,${item["poster"]}`} loading="lazy" alt="genres-bg" />                            
                </div>
                <ul className="genres__desc-list">
                    <li className="genres__desc-item genres__desc_title">
                        {item["genres"]}
                    </li>
                    <li className="genres__desc-item">
                        {`${item["genres_count"]} ${getPostfix("релиз", item["genres_count"])}`}
                    </li>
                </ul>
            </Link>
        </li>
    )
})


