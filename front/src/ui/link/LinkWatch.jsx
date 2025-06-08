import { Link } from "react-router-dom"

import "./style/link_watch.sass"


export function LinkWatch({alias, children}){
    return(
        <Link className="link__watch" to={alias}>
            <svg className="link__watch-svg">
                <use  xlinkHref="/main.svg#rectangle-svg"/>
            </svg>                 
            {children}
        </Link>
    )
}
