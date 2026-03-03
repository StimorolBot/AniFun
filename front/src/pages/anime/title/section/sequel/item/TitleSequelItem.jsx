import { memo } from "react"
import { Link } from "react-router-dom"

import { getPostfix } from "../../../../../../utils/utils"

import "./style.sass"


export const TitleSequelItem = memo(({item, index, title, imgData, ...props}) => {

    return(
        <li 
            className={title == item.title
                ? "title-continuation__item title-continuation__item_active"
                : "title-continuation__item"} 
            {...props}
        >
            <Link className="title-continuation__link" to={`/anime/${item.alias}`}>
                <div className="title-continuation__inner">
                    <div className="title-continuation__img-container">
                        <img src={imgData} alt="poster"/>
                    </div>
                    <div className="title-continuation__info">
                        <h4>
                            {item.title}
                        </h4>
                            <ul>
                                <li>{item.year}</li>
                                <li>{item.season}</li>
                                <li>{item.type}</li>
                                <li>{item.total_episode} {getPostfix("эпизод", item?.total_episode)}</li>
                                <li>{item.age_restrict}</li>
                            </ul>
                    </div>
                </div>
                <p className="title-continuation__number">
                    {`#${index}`}
                </p>
            </Link>
        </li>    
    )
})