export const formatDate = (dateString, locale = navigator.language) => {
	const date = new Date(dateString)
	const now = new Date()

	if (Number.isNaN(date.getTime())) {
		return ""
	}

	const isToday =
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()

	if (isToday) {
		return new Intl.DateTimeFormat(locale, {
			hour: "2-digit",
			minute: "2-digit",
		}).format(date)
	}

	return new Intl.DateTimeFormat(locale, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date)
}
