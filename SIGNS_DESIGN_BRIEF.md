# Signs Design Brief — отрисовка библиотеки знаков в Claude design

Текущие 64 знака нарисованы программно (параметрические SVG) и выглядят неточно. Задача дизайн-чата: перерисовать их точно и красиво, затем расширить библиотеку.

## Источник истины

Официальная система знаков ЮАР — **SARTSM** (South African Road Traffic Signs Manual), вариант SADC-системы. Серии: R (regulatory), W (warning), GS/GD (guidance/direction), IN (information), TR/TW (temporary). Всего в системе ~800+ типов знаков с вариациями. **Важно:** формы и цвета знаков предписаны законом и не являются объектом авторского права — мы рисуем СВОИ SVG по официальным спецификациям, не копируя чужие файлы (не брать SVG с чужих сайтов/приложений).

## Фазы

- **P0 (сейчас):** перерисовать точно текущие 64 знака — список ниже, id менять нельзя.
- **P1:** добить до ~150 ядра экзамена (все скоростные лимиты, все基 запреты/предписания, полный warning-набор, основные guidance/info, TR-набор).
- **P2 (v1.1+):** до 700+ для SEO-страниц.

## Формат деливери (жёстко)

1. Каждый знак — отдельный **SVG-файл `<id>.svg`**, `viewBox="0 0 120 120"`, знак вписан с полем ~6px, прозрачный фон.
2. **Только вектор**: path/circle/rect/polygon. Без растров, без `<image>`, без внешних шрифтов — весь текст на знаках (60, STOP, N1…) перевести в кривые (outline), чтобы рендер был идентичен везде и офлайн.
3. Палитра (официальные цвета ЮАР, менять нельзя): красный `#C8102E`, синий `#00539F`, зелёный `#007749`, жёлтый (temporary) `#F5C400`, чёрный `#1A1A1A`, белый `#FFFFFF`.
4. Вес: ≤ 2 KB на знак после оптимизации (SVGO), библиотека целиком должна оставаться в перф-бюджете low-data приложения.
5. К каждому батчу — **manifest.json**: массив объектов `{ id, name, category, sartsm: "R1"/"W101"/…, desc }`. Для P0 id/name/category/desc уже заданы — менять только точность отрисовки; sartsm-код добавить.
6. Категории: `regulatory | warning | guidance | information | temporary` (как в `data/signs.ts`).

## Критерии точности

- Геометрия по SARTSM: пропорции октагона STOP, углы треугольников, толщина колец запрета, наклон запрещающей диагонали (45°), стрелки по спецификации — не «на глаз».
- Знак должен быть узнаваем в 40px (превью в списке) и красив в 150px (drill/детальная).
- Проверка: рядом с реальным фото знака не должно быть заметных расхождений формы.

## Текущие 64 id (P0)

regulatory: stop, yield, no-entry, one-way, speed-60, speed-100, speed-120, min-speed-40, height-limit, weight-limit, no-stopping, no-parking, no-overtaking, no-cars, no-trucks, no-cyclists, no-pedestrians, no-u-turn, no-left-turn, proceed-straight, turn-left, turn-right, keep-left, roundabout, cycles-only, pedestrians-only
warning: w-general, w-crossroad, w-t-junction, w-curve-right, w-curve-left, w-hairpin, w-two-way, w-narrow, w-traffic-light, w-ped-crossing, w-children, w-animals, w-cyclists, w-railway, w-slippery, w-steep-down, w-rocks, w-hump, w-gravel, w-stop-ahead
guidance: g-route-n1, g-direction, g-freeway-dir, g-exit-300, g-dead-end, g-one-way-guide
information: i-info, i-hospital, i-fuel, i-phone, i-food, i-bed, i-parking
temporary: t-roadworks, t-narrow, t-stop-go, t-gravel, t-slippery

## Интеграция (для следующего дев-диалога)

SVG-файлы + manifest передаются в дев-чат; там: SVGO-оптимизация → инлайн в реестр компонентов (замена `components/SignSvg.tsx` на реестр из файлов) → проверка размера бандла → деплой. SEO-страницы и drill подхватят новые знаки автоматически из `data/signs.ts`.
