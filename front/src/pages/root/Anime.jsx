import { memo, useState } from "react"

import { AddTitleItem } from "./item/AddTitleItem"
import { AddEpisode } from "./item/AddEpisode"
import { AddRelationTitle } from "./item/AddRelationTitle"
import { SetSchedules } from "./item/SetSchedules"
import { AddSlide } from "./item/AddSlide"
import { DeleteSlide } from "./item/DeleteSlide"
import { DeleteTitle } from "./item/DeleteTitle"
import { DeleteRelationTitle } from "./item/DeleteRelationTitle"
import { DeleteEpisode } from "./item/DeleteEpisode"
import { DeleteSchedules } from "./item/DeleteSchedules"


import "./style/anime.sass"
import "./item/style/Item.sass"
import { InputSearch } from "../../ui/input/InputSearch"

export const Anime = memo(() => {
    const [search, setSearch] = useState("")

    return(
        <main className="main main_root">
            <h1 className="title-page">
                Root anime page
            </h1>
            <div className="container">
                <h2 className="subtitle-page">
                    Api_V1
                </h2>
                <search className="search-api">
                    <InputSearch placeholder={"Введите название действия"} val={search} setVal={setSearch}/>
                </search>   
                <ul className="root-anime__list">
                    {
                        search
                        ? <>{search}</>
                        :<>
                            <AddTitleItem/>
                            <AddRelationTitle/>
                            <SetSchedules/>                 
                            <AddEpisode/>
                            <span className="root-separation"/>
                            <AddSlide/>
                            <DeleteSlide/>
                            <span className="root-separation"/>
                            <DeleteTitle/>
                            <DeleteRelationTitle/>
                            <DeleteEpisode/>
                            <DeleteSchedules/>
                        </>
                    }
                </ul>
            </div>
        </main>
    )
})
