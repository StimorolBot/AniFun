export const getPostfix = (word, number) => {
	let n = Math.abs(number)

	n %= 100
	if (n >= 5 && n <= 20) return word + "ов"

	n %= 10
	if (n === 1) return word

	if (n >= 2 && n <= 4) return word + "а"

	return word + "ов"
}
