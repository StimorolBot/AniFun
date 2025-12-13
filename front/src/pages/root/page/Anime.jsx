import { memo, useEffect, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { useDebounce } from "../../../hook/useDebounce"

import { ApiItem } from "../item/ApiItem"
import { InputSearch } from "../../../ui/input/InputSearch"
import { AlertResponse } from "../../../ui/alert/AlertResponse"
import { Loader } from "../../../components/loader/Loader"


export const Anime = memo(() => {
    const fileData = new FormData()
    
    const [searchRoute, setSearchRoute] = useState("")
    const [isShow, setIsShow] = useState()
    const [payload, setPayload] = useState({})
    const [payloadFile, setPayloadFile] = useState({})
    const [response, setResponse] = useState()
    const [updateAlert, setUpdateAlert] = useState()
    
    const [responseApi, setResponseApi] = useState({
        "paths": [{
            "path": "",
            "method": "",
            "summary": "",
            "params": [{
                "param_name": "", 
                "type": "", 
                "valid_value": "",
                "transcription": "",
                "valid_params": {}
            }]
        }]
    })

    const [searchRouteList, setSearchRouteList] = useState(responseApi)

    const [getApiRequest, isLoadingApi, _] = useFetch(
        async () => {
            await api.get("admin/anime/api-list").then((r) => {
                setSearchRouteList(r.data)
                setResponseApi(r.data)
            })
        }
    )
    const [request, isLoading, error] = useFetch(
        async (e, method, path) => {
            e.preventDefault()
            if (Object.keys(payloadFile).length !== 0){
                Object.keys(payloadFile).map(key =>
                    fileData.append(key, payloadFile[key])
                )
                await api[method](`admin/anime/${path}`, fileData, {params: payload}).then((r) => setResponse(r))
            }
            else if (method.toLowerCase() === "delete")
                await api.delete(
                    `admin/anime/${path}`, 
                    {data: payload, headers: {"Content-Type": "application/json"}}
                ).then((r) => setResponse(r))
            else
                await api[method](`admin/anime/${path}`, payload).then((r) => setResponse(r))
        }
    )

    const debounceSearchVal = useDebounce(searchRoute)
    useEffect(() => {(
        async () => {
            await getApiRequest()
        })()
    }, [])
    console.log(responseApi)
    useEffect(() => {
        if (searchRoute.paths !== 0)
            setSearchRouteList(({
                "paths": responseApi?.paths?.filter(f => f?.summary?.toLowerCase().includes(searchRoute.toLowerCase()))
            }))
        else
            setSearchRouteList(responseApi)
    }, [debounceSearchVal])

    return(
        <main className="main main_root">
            <h1 className="title-page">
                Root anime page
            </h1>
            { isLoadingApi
                ? <Loader center={true}/>
                : <div className="container">
                    <h2 className="subtitle-page">
                        Вставить subNav
                    </h2>
                    <search className="search-api">
                        <InputSearch placeholder={"Введите название действия"} val={searchRoute} setVal={setSearchRoute}/>
                    </search>
                    <ul className="root-anime__list">
                        {
                            searchRouteList?.paths?.map((item, index) => {
                                return (
                                    <ApiItem
                                        item={item}
                                        setItem={setSearchRouteList}
                                        request={request}
                                        index={index} 
                                        isShow={isShow} 
                                        setIsShow={setIsShow} 
                                        payload={payload}
                                        setPayload={setPayload}
                                        setPayloadFile={setPayloadFile}
                                        response={response}
                                        isLoading={isLoading}
                                        setUpdateAlert={setUpdateAlert}
                                        key={index}
                                    />
                                )                            
                            })
                        }
                        {isLoading === false &&
                            <AlertResponse
                                msg={error?.response?.data || response?.data} 
                                statusCode={error?.status || response?.status} 
                                update={updateAlert}
                                setResponse={setResponse}
                                prefix={response? "success": "error"}
                            />
                        }
                    </ul>
                </div> 
            }
        </main>
    )
})
