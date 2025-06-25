import { memo } from "react"
import { Link } from "react-router-dom"

import "./style/search_item.sass"


export const SearchItem = memo(({item, ...props}) => {
    
    return(
        <li className="search-popup__item transition" {...props}>
            <Link className="search-popup__link" to={`anime/releases/release/${item["alias"]}/episodes`}>
                <div className="search-popup__img-inner">
                    <img className="search-popup__img" src={`data:image/webp;base64,${item["poster"]}`} alt="poster" />
                </div>
                <div className="search-popup__content">
                    <p className="search-popup__title">
                        {item["title"]}
                    </p>
                    <p className="search-popup__year">
                        {item["year"]}
                    </p>
                    <p className="search-popup__type">
                        {item["type"]}
                    </p>
                </div>
            </Link>
        </li>
    )
})
