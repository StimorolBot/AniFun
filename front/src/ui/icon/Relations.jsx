export const Relations = ({ ...props }) => {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
			<circle
				cx="12"
				cy="6"
				r="2.5"
				stroke="currentColor"
				strokeWidth="1.8"
			/>
			<circle
				cx="6"
				cy="17"
				r="2.5"
				stroke="currentColor"
				strokeWidth="1.8"
			/>
			<circle
				cx="18"
				cy="17"
				r="2.5"
				stroke="currentColor"
				strokeWidth="1.8"
			/>

			<path
				d="M10.5 8L7.5 15M13.5 8L16.5 15M8.5 17H15.5"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	)
}
