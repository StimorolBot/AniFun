import { useEffect, useState } from "react"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { HeaderSection } from "../components/header/HeaderSection"
import { FranchisesItem } from "../components/cards/FranchisesItem"
import { Loader } from "../components/loader/Loader"

import "./style/franchises.sass"


export function Franchises(){
    const [response, setResponse] = useState([{
        "age_restrict": null, "alias": null, 
        "poster": null, "season": null,
        "title": null, "type": null,
        "year": null 
    }])

    const [request, isLoading, error] = useFetch(
        async () => {
          await api.get("/franchises").then((r) => setResponse(r.data))
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    
    return(
        <section className="franchises">
            <div className="container">
                <HeaderSection 
                    title={"Популярный франшизы"} to={"/anime/franchises/"}
                    description={"Франшизы, которые могут заинтересовать вас"}
                />
                    {isLoading
                        ? <Loader isLoading={isLoading}/>
                        :<ul className="franchises__list">                    
                            {response?.map((item, index) => {
                                return(<FranchisesItem item={item} key={index}/>)
                            })}  
                        </ul> 
                    }
            </div>
        </section>
    )
}