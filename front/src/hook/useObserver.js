import { useEffect, useRef } from "react"


export const useObserver = async (
    lastElementRef, 
    isLoading, 
    isFetchNextPage,
    fetchNextPage,
    hasNextPage
) => {
    const observerRef = useRef(null)

    useEffect(() => {
        if (isLoading)
            return

        if (observerRef.current)
            observerRef.current.disconnect()

        const cb = async (entries, observer) => {
           if (entries[0].isIntersecting){
            fetchNextPage()
           }
        }

        observerRef.current = new IntersectionObserver(cb)
        observerRef.current?.observe(lastElementRef?.current)
    }, [
        isFetchNextPage,
        fetchNextPage,
        hasNextPage
    ])
}
