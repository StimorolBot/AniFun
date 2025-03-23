import { memo } from "react"
import { Link, useNavigate,  } from "react-router-dom"

import "./style/error.sass"


export const Error = memo(() => {
    const navigate = useNavigate()
    
    return(
        <main className="error">
            <h1 className="error__status-code">
                404
            </h1>
            <h3 className="error__detail">
                Извините, но мы не смогли найти страницу,
                <br /> 
                которую вы искали :(
            </h3>
            <div className="error__link-container">
                <Link className="error__link error__link_back" 
                    onClick={() => navigate(-1)}
                >
                    Назад
                </Link>
                <Link className="error__link" to={"/"}>
                    На главную
                </Link>
            </div>
        </main>
    )
})