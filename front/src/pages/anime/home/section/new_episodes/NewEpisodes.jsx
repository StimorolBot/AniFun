import { memo, useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { EpisodeItem } from "./item/EpisodeItem"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const NewEpisodes= memo(() => {
  const transitionRef = useRef()
  const [response, setResponse] = useState([{
    "uuid_episode": null,
    "episode_number": null,
    "alias": null,
    "title": null,
    "year": null,
    "type": null,
    "age_restrict": null,
    "season": null,
    "genres":[""],
    "poster": null
  }])

  const [request, isLoading, _] = useFetch(
    async () => {
      await api.get("/new-episode", {params: {"limit": 6}}).then((r) => setResponse(r.data))
    }
  )

  useEffect(() => {(
    async () => {
      await request()
    })()
  }, [])
  
  return(
    <section className="new-episodes">
      <div className="container">
        <WrapperSection title={"Новые эпизоды"} link={"anime/latests"} ref={transitionRef} value={isLoading}>
          <div className="container-new-episodes transition" ref={transitionRef}>
            { isLoading
              ? <Loader/>
              : <ul className="episode__list">
                {response?.map((item, index) => {
                  return <EpisodeItem item={item} key={index}/>
                })}
              </ul>
            }
          </div>
        </WrapperSection>
      </div>
    </section>
  )
})
