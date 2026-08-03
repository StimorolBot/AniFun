import { cookies } from "../cookie"

export const setTokens = (accessToken, refreshToken) => {
	cookies.set("access_token", accessToken, { path: "/" })
	cookies.set("refresh_token", refreshToken, { path: "/" })
}
