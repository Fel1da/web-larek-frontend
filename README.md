# Web-ларёк

Учебный проект «Web-ларёк» — интернет-магазин товаров для веб-разработчиков.
Реализован на TypeScript, паттерн Model–View–Presenter с использованием брокера событий для связи между слоями.

## Стек

- **TypeScript 5** — статическая типизация
- **Webpack 5** + `ts-loader` + `babel-loader` — сборка
- **SCSS** + `sass-loader` + `postcss-loader` + `autoprefixer`
- **ESLint** + `@typescript-eslint` + **Prettier** — контроль качества кода
- **dotenv** + `DefinePlugin` — чтение `API_ORIGIN` из `.env`
- REST API (`/api/weblarek`)
- Шаблонизация через нативные `<template>` в `src/pages/index.html`

## Установка и запуск

Для установки зависимостей и запуска dev-сервера:

```bash
npm install
cp .env.example .env    
npm run start
```

Dev-сервер откроется по адресу **http://localhost:8080/**.

### Файл `.env`

В корне проекта должен лежать файл `.env` со следующим содержимым:

```
API_ORIGIN=https://larek-api.nomoreparties.co
```

Слэш в конце **не ставится** — он добавляется в коде через `/api/weblarek`.
Значение подставляется в бандл плагином `DefinePlugin` в `webpack.config.js`
через `process.env.API_ORIGIN`.

### Сборка production

```bash
npm run build
```

Результат — папка `dist/`.

## Архитектура

Приложение построено по паттерну Model–View–Presenter. Связь между слоями обеспечивает брокер событий `EventEmitter` из стартового набора (`src/components/base/events.ts`). 

### Слои

| Слой | Каталог | Назначение |
|------|---------|------------|
| Данные (Model) | `src/components/models` | Хранят состояние приложения |
| Отображение (View) | `src/components/view` | Рендерят DOM, инициируют пользовательские события |
| Базовый код (Base) | `src/components/base` | `Api`, `EventEmitter`, `Component`, `Model` |
| Клиент API | `src/components/LarekApi.ts` | Специализированный клиент REST API |
| Презентер | `src/index.ts` | Связывает события моделей и отображений |
| Типы | `src/types/index.ts` | Типы данных, интерфейсы, enum событий |
| Утилиты | `src/utils` | Утилиты и константы |

### Базовые классы

- **EventEmitter** (`src/components/base/events.ts`) — обеспечивает работу событий.
  Методы: `on` (подписаться), `off` (отписаться), `emit` (инициировать событие с
  данными), `trigger` (создать колбэк, генерирующий событие), `onAll` (слушать все
  события), `offAll` (сбросить подписки). Реализует интерфейс `IEvents`.

- **Api** (`src/components/base/api.ts`) — базовый HTTP-клиент. Методы `get` и `post`, обрабатывает ответы `{ error }` от сервера. Хранит `baseUrl` и заголовки по умолчанию.

- **Component\<T\>** (`src/components/base/Component.ts`) — абстрактный базовый
  компонент отображения. Хранит корневой DOM-элемент в защищённом поле
  `container`, предоставляет защищённые хелперы `setText`, `setImage`,
  `toggleClass`, `setDisabled` и публичный метод `render(data?)`, который
  подставляет данные в поля класса и возвращает корневой элемент.

- **Model\<T\>** (`src/components/base/Model.ts`) — абстрактная модель данных.
  Хранит `data` и ссылку на `EventEmitter`. Метод `emitChanges(event, payload)`
  инициирует событие брокера; `getData()` возвращает копию данных.

- **LarekApi** (`src/components/LarekApi.ts`) — расширяет `Api`.
  Методы: `getProducts()` (возвращает `IProductsResponse`), `createOrder(order)` (возвращает `IOrderResult`).

### Модели данных

- **ProductsModel** (`src/components/models/ProductsModel.ts`) — хранит каталог товаров и выбранный товар для превью. Методы: `setProducts`, `setPreview`, `getProductById`, `getProducts`, `getPreview`. События: `products:loaded`, `preview:changed`.

- **CartModel** (`src/components/models/CartModel.ts`) — состав корзины.
  Методы: `add`, `remove`, `clear`, `has`, `getItems`, `getCount`, `getTotal`.
  Событие: `cart:changed`.

- **OrderModel** (`src/components/models/OrderModel.ts`) — данные покупателя
  (`payment`, `address`, `email`, `phone`). Методы: `setFields`, `getData`,
  `validate`, `clear`. Не эмитит события сам по себе — валидация и эмит
  выполняются в презентере на основе события `order:changed`.

### Компоненты отображения

- **Modal** — модальное


окно. Методы `open`, `close`, сеттер `content` для подстановки содержимого. Закрывается кликом по фону и по крестику; при закрытии эмитит `modal:close`.
- **Header** — кнопка корзины со счётчиком. Сеттер `counter`. Эмитит `basket:open`.
- **Gallery** — контейнер каталога. Метод `setItems(items)` принимает фабрику карточек через конструктор (слабое связывание). Клик по карточке эмитит `product:select { id }`.
- **Card** (абстрактный) — базовые сеттеры `title`, `price`.
  Наследники:
  - **CardCatalog** — карточка каталога (`image`, `category`);
  - **CardPreview** — карточка детального просмотра (`image`, `category`, `description`, `inCart`, `onClick`, `disabled`);
  - **CardBasket** — компактная карточка в корзине (`index`, кнопка удаления).
- **Basket** — содержимое корзины. Метод `setItems(items, total)` рендерит карточки через фабрику и подставляет сумму. Кнопка «Оформить» эмитит `order:open`.
- **Form** (абстрактный) — базовая форма. Сеттер `valid` управляет доступностью submit, `setErrors(errors)` выводит сообщения об ошибках.
  Наследники:
  - **OrderForm** — выбор оплаты (`card` / `cash`) и адрес доставки;
  - **ContactsForm** — email и телефон.
- **Success** — сообщение об успешной оплате. Сеттер `total`. Кнопка «За новыми покупками!» эмитит `modal:close`.

### Взаимодействие между слоями

Все взаимодействия — через события `EventEmitter`:

1. **Загрузка каталога.** `LarekApi.getProducts()` - `productsModel.setProducts()` -  `products:loaded` - галерея перерисовывается.
2. **Просмотр товара.** Клик по карточке - `product:select { id }` - `productsModel.setPreview()` - `preview:changed` - модалка с `CardPreview`.
3. **Корзина.** Кнопка «Купить/Убрать» - `cartModel.add/remove` - `cart:changed` - счётчик в хедере обновляется. Открытие корзины - `basket:open` - модалка с `Basket`.
4. **Оформление.** «Оформить» - `order:open` - `OrderForm`. Ввод полей формы - `order:changed` - `OrderModel.validate()` - презентер дизейблит/включает кнопку и выводит ошибки. Далее - `order:submit` - `ContactsForm` - `contacts:submit` - `LarekApi.createOrder()` - модалка с `Success`.

### Типы данных

Все типы и интерфейсы объявлены в `src/types/index.ts`. Декларации модулей (`*.scss`, `*.css`, `*.svg`, `process.env`) — в `src/types/global.d.ts`.

- **Данные из API:** `IProduct`, `IProductsResponse`.
- **Заказ:** `TPayment` (`'card' | 'cash'`), `ICustomer`, `IOrder`, `IOrderResult`.
- **Клиент API:** `IApi`, `IApiError`.
- **Базовый код:** `IEvents`, `IEmitterEvent`.
- **Отображение:** `IProductView`.
- **Фабрики:** `TCardFactory<T>` — сигнатура функции, создающей карточку по
  элементу и индексу.
- **События:** `enum AppEvents` — единый список всех событий приложения.

## Структура проекта

```
src/
├── components/
│   ├── base/
│   │   ├── api.ts              # базовый HTTP-клиент
│   │   ├── events.ts           # брокер событий + IEvents
│   │   ├── Component.ts        # абстрактный компонент отображения
│   │   └── Model.ts            # абстрактная модель данных
│   ├── models/
│   │   ├── ProductsModel.ts
│   │   ├── CartModel.ts
│   │   └── OrderModel.ts
│   ├── view/
│   │   ├── card/
│   │   │   ├── Card.ts
│   │   │   ├── CardCatalog.ts
│   │   │   ├── CardPreview.ts
│   │   │   └── CardBasket.ts
│   │   ├── form/
│   │   │   ├── Form.ts
│   │   │   ├── OrderForm.ts
│   │   │   └── ContactsForm.ts
│   │   ├── Modal.ts
│   │   ├── Header.ts
│   │   ├── Gallery.ts
│   │   ├── Basket.ts
│   │   └── Success.ts
│   └── LarekApi.ts
├── pages/
│   └── index.html
├── scss/
│   └── styles.scss
├── types/
│   ├── index.ts
│   └── global.d.ts
├── utils/
│   ├── constants.ts
│   ├── format.ts
│   └── utils.ts
└── index.ts                    # точка входа (презентер)
```

## Особенности конфигурации

### `tsconfig.json`

```json
{
 "compilerOptions": {
  "allowSyntheticDefaultImports": true,
  "noImplicitAny": true,
  "module": "esnext",
  "target": "es2017",
  "allowJs": true,
  "experimentalDecorators": true,
  "moduleResolution": "bundler"
 },
 "include": ["src"]
}
```

- `moduleResolution: "bundler"` — актуальный режим для сборщиков


(Webpack).
- `include: ["src"]` — покрывает все `.ts` и `.d.ts` внутри `src/`.
- `noImplicitAny: true` — запрещает неявные `any`.

### `src/types/global.d.ts`

Содержит декларации для импортов без типов (`.scss`, `.css`, `.svg`, `.png`, `.woff2` и т. д.), а также описание `process.env.API_ORIGIN`. 

### Утилиты

- `src/utils/utils.ts` — базовые хелперы стартового набора (`ensureElement`, `ensureAllElements`, `cloneTemplate`, `createElement`, `setElementData` и др.). `cloneTemplate` принимает как CSS-селектор (`'#basket'`), так и `HTMLTemplateElement`.
- `src/utils/format.ts` — форматирование цены (`formatPrice`) и получение модификатора категории (`getCategoryMod`).
- `src/utils/constants.ts` — `API_URL`, `CDN_URL`, объект `settings`.

## Применение принципов разработки

- **Единственная ответственность** — каждый класс решает ровно одну задачу. Модели хранят данные, отображения рендерят DOM, презентер связывает события, `Api` работает с сетью.
- **Слабое связывание** — экземпляры моделей и фабрик передаются в конструкторы (`Gallery`, `Basket`, `Modal` и др.) извне, а не создаются внутри классов.
- **Изолированность** — любой компонент можно переиспользовать в другом проекте, подставив свой `EventEmitter` и корневой DOM-элемент.
- **Масштабируемость** — новая функциональность добавляется через новый тип события и подписку в презентере; базовый код при этом не меняется.
- **Иерархия классов** — `Card` — базовый для трёх карточек, `Form` — базовый для двух форм, `Api` — базовый для `LarekApi`, `Model` — базовый для трёх моделей. Глубина наследования не превышает 2 уровней.
- **Отсутствие `any`** — везде используются конкретные типы или дженерики; 
`noImplicitAny: true` включён.


