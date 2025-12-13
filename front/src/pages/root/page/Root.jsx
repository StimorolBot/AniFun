import { memo } from "react"
import { Link } from "react-router-dom"

import "./root.sass"


export const Root = memo(() => {
    return(
        <main className="main main__r">
            <h1 className="title-page">
                Root page
            </h1>
            <nav className="root-nav">
                <ul className="root__list">
                    <li className="root__item">
                        <Link to={"anime"}>
                            Аниме
                        </Link>
                    </li>
                    <li className="root__item">
                        <Link to={"users"}>
                            Пользователи
                        </Link>
                    </li>
                </ul>
            </nav>
        </main>
    )
})
