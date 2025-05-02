import { useEffect } from "react"


export const useClickOutside = (ref, setVal, watchVal="") =>{
    
    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target) && (watchVal === "")) {
            setVal(false)
        }
      }
    
    useEffect(() => {
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    })
}
