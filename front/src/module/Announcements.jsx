import { useEffect, useState } from "react"
import { HeaderSection } from "../components/header/HeaderSection"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { Loader } from "../components/loader/Loader"
import { AnnounceItem } from "../components/cards/AnnounceItem"

import "./style/announcements.sass"


export function Announcements(){
    const [response, setResponse] = useState([{"1":1, "2":2},{"1":1, "2":2}])

    const [request, isLoading, error] = useFetch(
        async () => {
          await api.get("/announcements").then((r) => setResponse(r.data))
        }
    )
    
    useEffect(() => {(
        async () => {
            await request()
        })()
      }, [])
    
    return(
        <section className="announcements">
            <div className="container">
                <HeaderSection title={"Анонсы"} link={"/anime/announce"} description={"Самые горячие и свежие анонсы с аниме"}/>
                { isLoading
                    ? <Loader isLoading={isLoading}/>
                    : <ul className="announce__list">
                        {response.map((item, index) => {
                            return(<AnnounceItem item={item} key={index}/>)
                        })}
                    </ul>
                }                       
            </div>
        </section>
    )
} 