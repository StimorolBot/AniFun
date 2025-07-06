import { cookies } from "../cookie"

export const getPostfix = (word, number) => {
    let n = Math.abs(number)
    
    n %= 100
    if (n >= 5 && n <= 20)
        return word + "ов"
    
    n %= 10
    if (n === 1)
        return word
    
    if (n >= 2 && n <= 4)
      return word + "а"
    
    return word + "ов"
}

export const formatTime = (timeInSeconds) => {
    const result = new Date(Math.round(timeInSeconds) * 1000).toISOString().substring(11, 19)
    if (+result.substring(0, 2) > 0)
        return result
    else 
        return result.substring(3)
}

export const setTokens = (accessToken, refreshToken) => {
    cookies.set("access_token", accessToken, {path: "/"})
    cookies.set("refresh_token", refreshToken, {path: "/"})
}