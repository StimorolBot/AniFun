import { Link } from "react-router-dom"

import "./style/coming_soon_item.sass"


export function ComingSoonItem({item, ...props}){
    
    return(
        <li className="coming-soon__item" {...props}>
            <Link className="coming-soon__link" to={`/anime/releases/${item["alias"]}/episodes`}>  
                <img className="coming-soon__bg" src={`data:image/webp;base64,${item["poster"]}`} loading="lazy" alt="preview" />
                <p className="coming-soon__title">
                    {item["schedule_data"]["title"]}
                </p>
                <p className="coming-soon__episode">
                    {`${item["schedule_data"]["episode_number"]} ${"Эпизод"}`}
                </p>
                <ul className="coming-soon__desc-list">
                    <li className="coming-soon__desc-item">
                        {item["year"]}
                    </li>
                    <li className="coming-soon__desc-item">
                        {item["season"]}
                    </li>
                    <li className="coming-soon__desc-item">
                        {item["year"]}
                    </li>
                </ul>
                <ul className="coming-soon__desc-list">
                    {item["genres"]?.slice(-2)?.map((genre, index) => {
                        return(
                            <li className="coming-soon__desc-item" key={index}>
                                {genre}
                            </li>
                        )
                    })}
                </ul>
            </Link>
        </li>
    )
}