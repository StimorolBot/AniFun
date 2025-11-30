import { api } from "../api"
import { useFetch } from "./useFetch"
import { useObserver } from "./useObserver"


export const usePagination = (lastElementRef, response, setResponse) => {
    const canLoad = response?.page < response?.pages
    
    const [request, isLoading, error] = useFetch(
        async (path, ...props) => {
            await api.get(path, {params: {"size": 20, "page": response?.page, ...props[0]}})
            .then(r => {
                if (r.data.page === 1)
                    setResponse(r.data)
                else
                    setResponse(s => ({
                        "items": [...s.items, ...r.data.items],
                        "total": r.data.total, 
                        "page": r.data.page, 
                        "size": r.data.size,
                        "pages": r.data.pages,
                    }))
            })
        }
    )
    
    useObserver(lastElementRef, canLoad, isLoading,
        () => {setResponse(s => ({"page": s.page += 1, ...s}))}
    )
    
    return([request, isLoading, error])
}
