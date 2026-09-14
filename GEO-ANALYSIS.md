# GEO-анализ: готовность к ИИ-поиску

**Объект:** Hunter.Lease / CargwinNewCars
**Дата:** 2026-09-14
**Метод:** статический анализ репозитория (ветка `claude/skill-upload-setup-bet888`)

## Границы проверки

Живой сайт `https://hunter.lease/` **не проверен**: сетевой прокси этой среды отдаёт
`403` на CONNECT к этому хосту, отдельная попытка через второй инструмент вернула
`EGRESS_BLOCKED`. DNS резолвится (Cloudflare, `2606:4700:3037::ac43:c5cd`) — домен
существует, недоступность создана песочницей, а не сайтом. Проверка по `/robots.txt`,
`/llms.txt`, `/sitemap.xml` и `www.hunter.lease` дала тот же результат.

Ограничение снимается запуском Claude Code локально: оттуда сайт открывается с вашей
сети, и все проверки ниже можно выполнить по факту, а не по коду.

Поэтому **не проверено и требует ручной проверки**:

- выполняет ли хостинг пререндер или отдачу HTML ботам по User-Agent — это изменило бы
  вывод №1 целиком;
- реальная выдача `/robots.txt`, `/sitemap.xml` на боевом домене;
- фактические Core Web Vitals и ответы сервера.

Всё остальное ниже — из файлов репозитория, с указанием места.

## Оценка: 14 / 100

Оценка описывает **HTML, который получает краулер без исполнения JavaScript**. Для
пользователя с браузером сайт выглядит иначе.

| Критерий | Вес | Балл | Почему |
|---|---|---|---|
| Цитируемость пассажей | 25% | 10 | в отдаваемом HTML нет текста, кроме meta description |
| Структурная читаемость | 20% | 5 | в отдаваемом HTML нет ни одного заголовка |
| Мультимодальность | 15% | 15 | одна OG-картинка на внешнем домене, остальное за JS |
| Авторитет и бренд | 20% | 15 | нет авторства, нет дат, рейтинг захардкожен |
| Техническая доступность | 20% | 25 | ИИ-краулеры в robots.txt пропущены, но контента для них нет |

## 1. Блокирующая проблема: контент не отдаётся без JavaScript

**Это перекрывает все остальные пункты.** Пока он не решён, остальные правки почти
ничего не меняют.

Сборка — `react-scripts build` без пререндера (`frontend/package.json:scripts`).
В зависимостях нет ни `next`, ни `remix`, ни `react-snap`, ни `prerender`; есть только
`react-helmet-async`, а он работает в браузере.

Отдаваемый `frontend/public/index.html` содержит:

```html
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
```

ИИ-краулеры (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`) JavaScript не
выполняют. Всё, что они видят на любом URL сайта: `<title>`, `description`, OG-теги —
и фразу «You need to enable JavaScript to run this app».

Ни один оффер, ни одна цена, ни один FAQ в ИИ-поиск не попадают.

**Что делать, в порядке трудозатрат:**

1. Пререндер ключевых маршрутов на этапе сборки — самое дешёвое. Публичные страницы
   (`/`, `/offers`, `/deals`, `/offer/:id`, `/car/:carId`, `/compare`, `/calculator`,
   `/how-it-works`, `/about`) собираются в статические HTML.
2. Отдача готового HTML ботам на уровне хостинга или nginx по User-Agent.
3. Переезд на SSR-фреймворк — дороже всего, но решает задачу навсегда.

## 2. Вся микроразметка тоже за JavaScript

В `frontend/public/index.html` **ноль** блоков `application/ld+json`.

Размеченные типы есть, но живут в React-компонентах и рендерятся на клиенте —
`frontend/src/App.js:115-119`, `CarDetail.jsx`, `OffersPage.jsx`, `ArticlePage.jsx`,
`SEOPage.jsx`. Итого в коде: `AutomotiveDealer`, `Product`, `Offer`, `FAQPage`,
`Question`, `Answer`, `Article`, `Organization`, `ProductCollection`, `AggregateRating`.

Работа проделана — и не видна ни одному краулеру, который не исполняет JS.

**Хорошая новость:** серверный генератор схемы уже написан —
`backend/ai_schema_generator.py`, с комментарием «Makes Hunter.Lease visible to AI
assistants». Он **нигде не импортируется**: поиск по репозиторию не нашёл ни одного
обращения к нему за пределами самого файла. Модуль мёртвый.

То есть половина решения пункта №1 уже лежит в репозитории и просто не подключена.

**Отдельно:** для карточек машин `Product` — не лучший выбор. У schema.org есть
`Vehicle` и `Car` со специализированными полями (`vehicleEngine`, `mileageFromOdometer`,
`modelDate`, `vehicleTransmission`). Для ИИ-ответов про конкретные модели это заметно
точнее.

## 3. Рейтинг 4.9 из 847 отзывов захардкожен

`frontend/src/App.js:83`:

```js
"aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "847"}
```

Это литерал в коде, а не агрегат по реальным данным. В бэкенде есть эндпоинты
`/video-reviews` и `/admin/video-reviews`, но с этим числом они никак не связаны.

Два риска:

- **Политика Google по структурированным данным** требует, чтобы разметка отзывов
  соответствовала отзывам, видимым на той же странице. Несоответствие — основание для
  ручных санкций и потери rich-результатов.
- ИИ-системы цитируют рейтинг как факт о компании. Неподтверждаемое число попадёт в
  ответы от вашего имени.

**Решение:** считать из фактических отзывов и выводить их на странице, либо убрать
`aggregateRating` до появления реальных данных. Второе — безопаснее и делается за минуту.

## 4. OG-теги указывают на чужой домен

**Боевой домен проекта — `hunter.lease`.** `cargwin-newcar.emergent.host` — служебный
хост платформы, к проекту отношения не имеет.

Большая часть кода это уже знает: `robots.txt` (три директивы `Sitemap:`), поле `url` в
схеме (`App.js:82`), `ai_schema_generator.py` — везде `hunter.lease`.

Два места отстали:

| Файл | Строка | Сейчас | Должно быть |
|---|---|---|---|
| `frontend/public/index.html` | 15 | `og:url` → `cargwin-newcar.emergent.host` | `https://hunter.lease/` |
| `frontend/public/index.html` | 22 | `twitter:url` → `cargwin-newcar.emergent.host` | `https://hunter.lease/` |

Это не косметика. `og:url` — заявление о канонической версии страницы для всего, что
читает Open Graph: соцсетей, мессенджеров, части парсеров. Сейчас сайт сам указывает на
служебный хост как на себя.

Тега `rel="canonical"` в `index.html` нет вообще. Для SPA с параметрами в URL это прямой
путь к дублям. Добавить `<link rel="canonical" href="https://hunter.lease/" />` и
переопределять его на маршрутах через `react-helmet-async`.

Заодно в том же файле, строки 88–92: блок `id="emergent-badge"` со ссылкой на
`https://app.emergent.sh/?utm_source=emergent-badge` — исходящая ссылка с боевого сайта
на платформу-конструктор. Решение продуктовое, не SEO-шное, но на сайте автолизинга она
вряд ли нужна.

Отдельно: `frontend/src/pages/Auth.jsx:81` завязан на `auth.emergentagent.com` через
`REACT_APP_EMERGENT_AUTH_URL`. Это рабочая зависимость авторизации, а не забытая ссылка —
трогать её в рамках SEO-правок нельзя.

## 5. robots.txt: устаревшие и пропущенные имена ботов

Текущий файл (`frontend/public/robots.txt`) перечисляет `GPTBot`, `ChatGPT-User`,
`Claude-Web`, `PerplexityBot`, `Google-Extended`.

Три замечания по сути:

- **`Claude-Web` — не существует.** Актуальные агенты Anthropic: `ClaudeBot` (обучение),
  `Claude-SearchBot` (цитируемость в поиске Claude), `Claude-User` (переход по запросу
  пользователя). Текущая группа не делает ничего.
- **`OAI-SearchBot` не указан** — а именно он определяет, может ли ChatGPT Search
  процитировать страницу. `GPTBot`, который в файле есть, отвечает только за обучение
  модели и к цитируемости отношения не имеет. Заблокированным `OAI-SearchBot` не
  является: он попадает под `User-agent: *` с `Allow: /`. Но список создаёт ложное
  ощущение, что про ChatGPT позаботились.
- **`Google-Extended` управляет обучением и гроундингом Gemini/Vertex, но не выдачей
  Google.** Попадание в AI Overviews и AI Mode определяется обычным `Googlebot`. Это
  не ошибка в файле, но не стоит считать эту строку заботой об AI Overviews.

**Реальная дыра:** в каждой пер-ботовой группе есть только `Allow:` и нет ни одного
`Disallow:`. По стандарту бот со своей группой игнорирует группу `*` целиком — значит,
запреты на `/admin`, `/admin/*`, `/api/admin/*`, `/dashboard`, `/auth` на `GPTBot`,
`ChatGPT-User`, `PerplexityBot` и `Google-Extended` **не распространяются**. Им явно
разрешено ходить в админку и личный кабинет.

Исправленный фрагмент:

```
User-agent: OAI-SearchBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/admin/*
Disallow: /dashboard
Disallow: /auth

User-agent: Claude-SearchBot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/admin/*
Disallow: /dashboard
Disallow: /auth
```

Те же пять строк `Disallow:` нужно добавить в группы `GPTBot`, `ChatGPT-User`,
`PerplexityBot` и `Google-Extended`, а группу `Claude-Web` заменить на `ClaudeBot`.

## 6. llms.txt отсутствует

Файла `/llms.txt` в `frontend/public/` нет.

Трезво о его ценности: Google в своём руководстве по оптимизации под ИИ прямо пишет, что
`llms.txt` не нужен для Google Search и не влияет на видимость. Как рычаг ранжирования в
Google он не работает — не ждите от него эффекта там.

Но в вашем случае у него есть конкретный смысл, которого обычно нет. В бэкенде живут
три готовых JSON-эндпоинта: `/api/ai/recommendations`, `/api/ai/pricing-data`,
`/api/ai/comparison`. Это машиночитаемые данные о ценах и моделях, которые не требуют
исполнения JS. `robots.txt` их разрешает (`Allow: /api/ai/*`), но **ничто на них не
ссылается** — краулер их не найдёт.

`llms.txt` — подходящее место, чтобы на них указать:

```
# Hunter.Lease
> Fleet pricing on new car leases in California. No dealer markup.

## Data
- [Pricing data](https://hunter.lease/api/ai/pricing-data): current lease pricing by model
- [Comparison](https://hunter.lease/api/ai/comparison): model-to-model comparison
- [Recommendations](https://hunter.lease/api/ai/recommendations): matching by budget and needs

## Key facts
- Service area: California
- Languages: English, Russian
```

## 7. Аналитика не подключена

`frontend/public/index.html`: идентификатор Google Analytics — плейсхолдер
`G-XXXXXXXXXX`, в двух местах. Данных не собирается. Это не про ИИ-поиск, но без
аналитики эффект любых правок ниже вы не увидите.

## Пять изменений с наибольшим эффектом

| № | Что | Эффект | Трудозатраты |
|---|---|---|---|
| 1 | Пререндер публичных маршрутов в статический HTML | решающий: без него сайта для ИИ-поиска не существует | высокие |
| 2 | Подключить `ai_schema_generator.py` и отдавать JSON-LD в исходном HTML | высокий; код уже написан | низкие |
| 3 | Убрать или обосновать `aggregateRating` 4.9/847 | снимает риск санкций | минимальные |
| 4 | Починить robots.txt: `OAI-SearchBot`, `Claude-SearchBot`, `Disallow` в каждой группе | средний; закрывает админку от ИИ-ботов | минимальные |
| 5 | Переписать `og:url` и `twitter:url` на `hunter.lease`, добавить `rel="canonical"` | средний | минимальные |

Пункты 3 и 4 делаются за один подход и не зависят ни от чего. Пункт 2 имеет смысл
только вместе с пунктом 1 — иначе схема останется в HTML, где нет контента, который она
описывает.

## Чего в этом отчёте нет

Скил `seo-geo` предполагает ещё анализ упоминаний бренда на Wikipedia, Reddit, YouTube и
LinkedIn (по данным Ahrefs упоминания коррелируют с цитируемостью в ИИ примерно втрое
сильнее, чем ссылки) и разбор цитируемости отдельных пассажей по 134–167 слов. И то и
другое требует доступа к живому сайту и внешним источникам, которого у этой сессии нет.
Пассажный разбор к тому же бессмысленно делать до пункта №1: пока краулер не видит
текста, не важно, как этот текст нарезан.
