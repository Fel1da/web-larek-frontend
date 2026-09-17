export type TPriceFormatter = (value: number | null) => string;

export const priceFormatter: TPriceFormatter = (value) => {
	if (value === null || Number.isNaN(value)) {
		return 'Бесценно';
	}
	return `${value.toLocaleString('ru-RU')} синапсов`;
};

export function cloneTemplate<T extends HTMLElement = HTMLElement>(
	query: string | HTMLTemplateElement
): T {
	let template: HTMLTemplateElement | null;

	if (typeof query === 'string') {
		template = query.startsWith('#')
			? (document.getElementById(query.slice(1)) as HTMLTemplateElement | null)
			: (document.querySelector(query) as HTMLTemplateElement | null);
	} else {
		template = query;
	}

	if (!template) {
		throw new Error(`Шаблон ${query} не найден`);
	}
	if (!template.content?.firstElementChild) {
		throw new Error(`Шаблон ${query} пустой`);
	}

	return template.content.firstElementChild.cloneNode(true) as T;
}