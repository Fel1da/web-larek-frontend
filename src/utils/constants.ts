export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	paymentLabels: {
		card: 'Картой',
		cash: 'Наличными',
		online: 'Онлайн',
	} as const,
};
