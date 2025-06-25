import { memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { Loader } from "../../../components/loader/Loader"
import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"


export const AddRelationTitle = memo(() => {
    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState({"statusCode": null, "data": null})
    const [payload, setPayload] = useState({"title": "", "relation_title": ""})

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()
            await api.post("/admin/anime/add-relation-title", payload)
            .then((r) => setResponse({"data": JSON.stringify(r.data, null, 2), "statusCode": r.status}))
        }
    )
    
    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_post">
                <HeaderRouteRa method="post" title="Добавить связь между аниме" isActive={isActive} setIsActive={setIsActive}/>
                <form
                    className={isActive ? "ra__body ra__body_active" : "ra__body"}
                    onSubmit={async (e) => await request(e)}
                >
                    <table className="ra__table">
                        <thead>
                            <tr>
                                <th>Параметр</th>
                                <th>Значение</th>
                            </tr>
                        </thead>
                        <tbody className="ra__tbody">
                            <RaTrInput 
                                minLength={3} 
                                maxLength={150} 
                                placeholder="Введите название аниме"
                                payload={payload}
                                value={payload.title}
                                field={"title"}
                                setPayload={setPayload}
                            />
                            <RaTrInput 
                                minLength={3} 
                                maxLength={150}
                                title={"Продолжение"}
                                placeholder="Введите название продолжения аниме"
                                payload={payload}
                                value={payload.relation_title}
                                field={"relation_title"}
                                setPayload={setPayload}
                            />
                        </tbody>
                    </table>
                    {isLoading
                        ? <Loader/>
                        : <button className="ra__btn">Добавить связь</button>
                    }
                    {response.statusCode !== null &&
                        <code className="ra-response">
                            <p> Статус код: {response?.statusCode}</p>
                            <pre>{response?.data}</pre>
                        </code>
                    }
                </form>
            </div>
        </li>
    )
})
