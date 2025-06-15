import { memo, useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { EpisodeItem } from "../components/cards/EpisodeItem"
import { HeaderSection } from "../components/header/HeaderSection"
import { Loader } from "../components/loader/Loader"

import "./style/last_episodes.sass"


export const LastEpisodes= memo(() => {
  const transitionRef = useRef()
  const [response, setResponse] = useState([{
    "episode_data":{
      "schedule_rs":{
        "episode_number": null
      },
      "anime_data":{
        "alias": null,
        "title": null,
        "year": null,
        "type": null,
        "age_restrict": null,
        "season": null,
      }
    },
    "genres":[""],
    "poster": null
  }])
    
  const [request, isLoading, error] = useFetch(
    async () => {
      await api.get("/last-title").then((r) => setResponse(r.data))
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
        <HeaderSection 
          title={"Новые эпизоды"} link={"anime/releases/latest/"} 
          description={"Недавно добавленные эпизоды с аниме"}
        />
        <SwitchTransition mode="out-in">
          <CSSTransition 
            classNames="transition" 
            key={isLoading}
            nodeRef={transitionRef} 
            timeout={300}
          >
            <div className="container-new-episodes transition" ref={transitionRef}>
              { isLoading
                ? <Loader/>
                :<ul className="episode__list">
                  {response?.map((item, index) => {
                    return <EpisodeItem item={item} key={index}/>
                  })}
                </ul>
              }
            </div>
          </CSSTransition>
        </SwitchTransition>                            
      </div>
    </section>
  )
})
