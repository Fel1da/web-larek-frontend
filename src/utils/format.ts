export function formatPrice(value: number | null | undefined): string {
	if (value === null || value === undefined) return 'Бесценно';
	return `${value.toLocaleString('ru-RU')} синапсов`;
}

export function getCategoryMod(category: string): string {
	const map: Record<string, string> = {
		'софт-скил': 'soft',
		'хард-скил': 'hard',
		'дополнительное': 'additional',
		'кнопка': 'button',
		'другое': 'other',
	};
	return map[category] ?? 'other';
}