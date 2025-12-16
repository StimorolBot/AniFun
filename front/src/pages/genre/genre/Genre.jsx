import { memo } from "react"
import { Helmet } from "react-helmet"

import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import "./style.sass"


export const Genre = memo(() => {    
     return(<>
        <Helmet>
            <title>Жанр</title>
        </Helmet>    
        <div className="wrapper">
            <Header/>
            <main className="main">
            </main>
            <Footer/>
        </div>
    </>
    )
})