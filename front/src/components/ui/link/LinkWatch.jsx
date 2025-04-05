import { Link } from "react-router-dom"

import "./style/link_watch.sass"


export function LinkWatch(){
    return(
        <Link className="link__watch" to={"#заглушка"}>
            <svg className="link__watch-svg">
                <use  xlinkHref="/public/main.svg#rectangle-svg"></use>
            </svg>                 
            Смотреть
        </Link>
    )
}
