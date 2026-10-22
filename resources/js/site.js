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
