import { useEffect } from "react"


export const useClickOutside = (ref, setVal, watch="") =>{
    
    const handleClick = (e) => {
        if ((ref.current && !ref.current.contains(e.target)) && (watch === "")) {
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
