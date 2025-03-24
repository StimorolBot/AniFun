import Cookies from "universal-cookie"

export const cookies = new Cookies()
cookies.sameSite = "none"
cookies.partitioned = true
cookies.httpOnly = true
