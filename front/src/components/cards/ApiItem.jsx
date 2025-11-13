import { Fragment, memo } from "react"

import { InputTr } from "../table/InputTr"
import { Loader } from "../loader/Loader"
import { BtnRoot } from "../../ui/btn/BtnRoot"
import { BtnSwitch } from "../../ui/btn/BtnSwitch"

import "./style/api_item.sass"


export const ApiItem = memo(({
    item, payload, request, index, isShow, 
    setIsShow, setItem, setPayload, setPayloadFile, setUpdateAlert, 
    ...props
}) => {

    const resetValue  = () => {
        setIsShow(-1)
        setPayload({})
        setPayloadFile({})
    }

   return(
        <li className={`root-anime__item root-anime__item_${item?.method}`} key={item.path}>
            <header className="root-anime__item-header">
                <p className={`root-anime__method root-anime__method_${item.method}`}>
                    {item.method}
                </p>
                <p className="root-anime__title">
                    {item.summary}
                </p>
                <div className="root__btn-switch">
                    <BtnSwitch 
                        value={isShow == index? true : false}
                        callback={() => {isShow == index
                            ? resetValue() 
                            : setIsShow(index)
                        }}
                    >
                        {isShow == index
                            ? <use xlinkHref="/main.svg#arrow-up-svg"/>
                            : <use xlinkHref="/main.svg#arrow-down-svg"/>
                        }
                    </BtnSwitch>
                </div>
            </header>
            <form 
                className={isShow == index? "root-anime__form root-anime__form_is-show" : "root-anime__form"}
                onSubmit={async (e) => await request(e, item.method, item.path)}
            >
                <table className="root-anime__table">
                    <thead>
                        <tr>
                            <th>Параметр</th>
                            <th>Значение</th>
                        </tr>
                    </thead>
                    <tbody className="root-anime__tbody">
                        {item.params.map((i, localIdex) => {
                            return(
                            <Fragment key={localIdex}>
                                {i.type === "add_list" 
                                ?
                                <>
                                    {i.item.map((value, indexInput) => {
                                        const countValueRepeat = item.params.at(-1).count_value_repeat
                                        const indexCurrentValue = [Math.floor(indexInput/countValueRepeat)]
                                        
                                        return(
                                            <InputTr 
                                                i={value} 
                                                payload={payload?.item?.[indexCurrentValue]} 
                                                setPayload={setPayload}
                                                onChange={e => setPayload(s => {
                                                    if (!s["item"]) 
                                                        s["item"] = []
                                                    if (!s["item"][indexCurrentValue])
                                                        s["item"][indexCurrentValue] = {}

                                                    s["item"][[indexCurrentValue]] = {
                                                        ...s["item"][indexCurrentValue], 
                                                        [value.param_name]: e.target.value
                                                    }
                                                    return {...s}
                                                } )}
                                                key={indexInput}
                                            />
                                        )
                                    })}
                                    <tr>
                                        <th/>
                                        <th className="root__btn-container">
                                            <BtnRoot
                                                type="button"
                                                prefix={"btn-root_add"}
                                                clickCallback={() => {
                                                    setItem(s => {
                                                        const countValueRepeat = -s.paths[index].params.at(-1).count_value_repeat
                                                        const prevValue = s.paths[index].params.at(-1)?.item.slice(countValueRepeat)
                                                        s.paths[index].params.slice(-1)[0].item.push(...prevValue)
                                                        return {...s}
                                                    })
                                                } }    
                                            >
                                                Добавить
                                            </BtnRoot>
                                            <BtnRoot
                                                type="button"
                                                prefix={"btn-root_remove"}
                                                clickCallback={() =>{
                                                    setItem(s => {
                                                        const params = s.paths[index].params
                                                        const countValueRepeat = params.at(-1).count_value_repeat
                                                        const valueList = params.slice(-1)[0].item

                                                        if (valueList.length > countValueRepeat)
                                                            s.paths[index].params.slice(-1)[0].item.splice(-countValueRepeat)

                                                        return {...s}
                                                    })
                                                    setPayload(s => {
                                                        if (s.item?.length > 1)
                                                            s.item.splice(-1)
                                                        return {...s}
                                                    })
                                                }}
                                            >
                                                Удалить
                                            </BtnRoot>
                                        </th>
                                    </tr>
                                </>
                                : <InputTr
                                    i={i} 
                                    payload={payload} 
                                    setPayload={setPayload} 
                                    onChange={e => setPayload(s => ({...s, [i.param_name]: e.target.value}))}
                                    setPayloadFile={setPayloadFile}
                                    key={index}/>}
                            </Fragment>)
                        })}
                    </tbody>
                 </table>
                {props?.isLoading
                    ?<Loader/>
                    :<div className="root__btn-container">
                        <BtnRoot type="submit" clickCallback={() => setUpdateAlert(Date.now())}>
                            Создать
                        </BtnRoot>
                    </div>
                }
            </form>
        </li>
    )
})
