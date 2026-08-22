export const pluralize = (number, one, few, many) => {
	const n = Math.abs(number) % 100
	const last = n % 10

	if (n >= 11 && n <= 19) return many
	if (last === 1) return one
	if (last >= 2 && last <= 4) return few

	return many
}
