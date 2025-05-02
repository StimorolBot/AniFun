import { memo } from "react"
import { Link } from "react-router-dom"

import { BtnArrow } from "../../ui/btn/BtnArrow"

import "./style/header_section.sass"


export const HeaderSection = memo(({title, link, description, children}) => {
    
    return(
        <header className="section__header">
            <div className="section__inner">
                <Link className="section__link" to={link}>
                    <h2 className="section__title">
                        {title}
                    </h2>
                    <BtnArrow/>
                </Link>
                <p className="section__description">
                    {description}
                </p>
            </div>
            {children}
        </header>
    )
})