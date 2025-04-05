import { Link } from "react-router-dom"
import { Episode } from "../ui/cards/Episode"

import "./style/new_episodes.sass"


export function NewEpisodes(){
    
    return(
        <section className="new-episodes">
            <div className="container">
                <Link className="section__link" to={"#"}>
                    <h2 className="section__title">
                        Новые эпизоды
                    </h2>
                </Link>
                <ul className="episode__list">
                    <Episode/>
                    <Episode/>
                    <Episode/>
                    <Episode/>
                    <Episode/>
                    <Episode/>
                </ul>                
            </div>
        </section>
    )
}