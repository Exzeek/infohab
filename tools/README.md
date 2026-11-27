# Збірка сайту urokinfo.com.ua

Репозиторій клонувати в `/home/claude/infohab` (шляхи в скриптах абсолютні). Після будь-яких змін у `index.html` (масив `TOPICS`), сторінках `a/<id>/` чи середовищах:

    bash tools/rebuild.sh

Порядок: банк Інфо-битви → TOPICS із хаба → SEO-мета (`seo_meta.py`, `seo_inject.py`) → коди (`codes.py`, закріплені в `data/codes_pinned.json`: старі коди ніколи не змінюються) → сторінки класів/розділів → бібліотека `/vse/` і `site/catalog.json` → редиректи кодів, `/kody/`, sitemap → спільна шапка (`nav_apply.py`) → каталог середовищ → Open Graph.

Дані: `data/cats.json` (категорії Інфо-битви), `data/site_arts.json` (назви артефактів для a/-сторінок), `data/codes.json` (останні коди).
Скрипт ідемпотентний: повторний запуск без змін нічого не змінює. Перед `git push` завжди `git pull --ff-only`.
