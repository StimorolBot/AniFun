import { memo } from "react"
import { Helmet } from "react-helmet"

import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import "./style.sass"


export const Genres = memo(() => {    
     return(<>
        <Helmet>
            <title>Жанры</title>
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