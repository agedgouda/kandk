// Mobile menu
document.querySelectorAll('[data-menu-toggle]').forEach((button) => {
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        button.setAttribute('aria-expanded', open);
    });
});

// Hero slider
document.querySelectorAll('[data-slider]').forEach((slider) => {
    const slides = [...slider.querySelectorAll('[data-slide]')];
    let current = 0;
    let timer;

    const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === current;
            slide.classList.toggle('opacity-100', active);
            slide.classList.toggle('opacity-0', !active);
            slide.classList.toggle('pointer-events-none', !active);
            slide.querySelector('[data-slide-bg]').classList.toggle('scale-110', active);
        });
    };

    const restart = () => {
        clearInterval(timer);
        timer = setInterval(() => show(current + 1), 4500);
    };

    slider.querySelector('[data-slide-prev]').addEventListener('click', () => { show(current - 1); restart(); });
    slider.querySelector('[data-slide-next]').addEventListener('click', () => { show(current + 1); restart(); });

    show(0);
    restart();
});

// Accordion (one open at a time)
document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const items = accordion.querySelectorAll('[data-accordion-item]');
    items.forEach((item) => {
        item.querySelector('button').addEventListener('click', () => {
            const wasOpen = item.hasAttribute('data-open');
            items.forEach((other) => other.removeAttribute('data-open'));
            if (!wasOpen) item.setAttribute('data-open', '');
        });
    });
});

// Load More: show the first N cards, reveal N more per click
document.querySelectorAll('[data-load-more]').forEach((grid) => {
    const step = parseInt(grid.dataset.loadMore, 10);
    const cards = [...grid.children];
    const wrap = grid.parentElement.querySelector('[data-load-more-button]');
    let shown = step;

    const update = () => {
        cards.forEach((card, i) => card.classList.toggle('hidden', i >= shown));
        wrap?.classList.toggle('hidden', shown >= cards.length);
    };

    wrap?.querySelector('button').addEventListener('click', () => {
        shown += step;
        update();
    });

    update();
});

// Masonry: move each card into the shortest column (only when there is more than one column)
document.querySelectorAll('[data-masonry]').forEach((grid) => {
    const cards = [...grid.children];
    let lastCount = 0;

    const layout = () => {
        const count = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        if (count === lastCount) return;
        lastCount = count;
        cards.forEach((card) => card.remove());
        grid.querySelectorAll('[data-masonry-col]').forEach((col) => col.remove());
        if (count < 2) { cards.forEach((card) => grid.append(card)); return; }
        const cols = Array.from({ length: count }, () => {
            const col = document.createElement('div');
            col.dataset.masonryCol = '';
            grid.append(col);
            return col;
        });
        cards.forEach((card) => cols.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a)).append(card));
    };

    layout();
    window.addEventListener('resize', layout);
});

// Character counter under text areas
document.querySelectorAll('textarea[data-counter]').forEach((area) => {
    const count = area.parentElement.querySelector('[data-counter-count]');
    const update = () => { count.textContent = area.value.length; };
    area.addEventListener('input', update);
    update();
});
