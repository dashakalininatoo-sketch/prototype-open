/* Fixed Lesnaya Kollekciya snapshot: the first five visible results in each tab.
   This demo models loading motion only; cards and filters are intentionally inert. */
(() => {
  'use strict';
  const data = {
    flats: [
      {area:38.5, price:13370341, oldPrice:16712926, floor:13, image:'flat-327403358.webp'},
      {area:40.4, price:14129377, oldPrice:17661721, floor:20, image:'flat-327403371.webp'},
      {area:38, price:13857788, oldPrice:16303280, floor:9, image:'flat-326671624.webp'},
      {area:40.4, price:14266645, oldPrice:16784288, floor:9, image:'flat-326671642.webp'},
      {area:40, price:14470871, oldPrice:17024554, floor:13, image:'flat-327403351.webp'}
    ],
    plans: [
      {area:38, price:13857788, oldPrice:16303280, offers:3, image:'layout-2890575765.webp'},
      {area:38, price:14999570, oldPrice:null, offers:2, image:'layout-2890574941.webp'},
      {area:38.5, price:13370341, oldPrice:16712926, offers:5, image:'layout-2890576446.webp'},
      {area:40, price:14470871, oldPrice:17024554, offers:4, image:'layout-2890576388.webp'},
      {area:40.4, price:14129377, oldPrice:17661721, offers:4, image:'layout-2890576494.webp'}
    ]
  };
  const results = document.querySelector('#results');
  const tabs = Array.from(document.querySelectorAll('[data-mode]'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = 'flats';
  let run = 0;
  let loadTimer;
  let colorTimer;
  let fadeTimer;
  let releaseTimer;
  let expansionTimer;
  let expansionFrame;

  const money = value => value.toLocaleString('ru-RU') + ' ₽';
  const area = value => value.toLocaleString('ru-RU') + ' м²';
  const apartmentWord = count => count % 10 === 1 && count % 100 !== 11 ? 'квартира' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'квартиры' : 'квартир';
  const resultLabel = () => mode === 'flats' ? '8 подходящих квартир' : '5 подходящих планировок';
  const footer = (loading = true) => '<div class="loading-footer">' + (loading ? '' : '<nav class="kit-pagination" aria-label="Страницы результатов"></nav>') + '<div class="kit-matching" role="status" aria-label="Загружаем предложения" data-phase="loading" data-label="' + resultLabel() + '"></div></div>';
  const skeleton = () => '<div class="loading-row" aria-hidden="true"><span class="loading-photo"></span><span class="loading-copy"><span class="loading-bar loading-shimmer"></span><span class="loading-bar loading-shimmer"></span></span>' +
    (mode === 'flats' ? '<span class="loading-bar loading-meta loading-shimmer"></span>' : '') +
    '<span class="loading-bar loading-price loading-shimmer"></span>' +
    (mode === 'flats' ? '<span class="loading-actions"><span class="loading-action loading-shimmer"></span><span class="loading-action loading-shimmer"></span></span>' : '<span class="loading-plan-cta"><span class="loading-plan-button loading-shimmer"></span></span>') + '</div>';
  function card(item) {
    const plan = mode === 'plans';
    const discount = item.oldPrice ? Math.round((item.oldPrice - item.price) / item.oldPrice * 100) : 0;
    const badges = '<div class="badges">' +
      (discount ? '<span class="label label-positive">Скидка ' + discount + '%</span>' : '') +
      ((!plan || item.oldPrice) ? '<span class="label label-neutral">Без отделки</span>' : '') +
      '</div>';
    const title = '1-комнатная · ' + area(item.area);
    const price = (plan ? 'от ' : '') + money(item.price);
    const oldPrice = !plan && item.oldPrice ? '<span class="old-price"><s>' + money(item.oldPrice) + '</s></span>' : '';
    return '<article class="row"><div class="photo"><img src="assets/' + item.image + '" alt=""></div>' +
      '<div class="title"><strong>' + title + '</strong>' + badges + '</div>' +
      (plan ? '' : '<span class="cell building-cell">Корпус 5</span><span class="cell date-cell">2 кв. 2029</span><span class="cell floor-cell">' + item.floor + ' из 28</span>') +
      '<div class="price"><strong>' + price + '</strong>' + oldPrice + '</div>' +
      (plan ? '<span class="plan-cta"><span class="button secondary">' + item.offers + ' ' + apartmentWord(item.offers) + '</span></span>' :
        '<span class="actions kit-actions" aria-hidden="true"></span>') +
      '</article>';
  }
  function resetMotion() {
    clearTimeout(loadTimer);
    clearTimeout(colorTimer);
    clearTimeout(fadeTimer);
    clearTimeout(releaseTimer);
    clearTimeout(expansionTimer);
    if (expansionFrame !== undefined) cancelAnimationFrame(expansionFrame);
    expansionFrame = undefined;
    results.style.removeProperty('height');
    results.style.removeProperty('overflow');
    results.style.removeProperty('transition');
  }
  function showLoading() {
    const token = ++run;
    resetMotion();
    window.CianKitDemo?.unmountResults();
    results.setAttribute('aria-busy', 'true');
    results.innerHTML = skeleton().repeat(3) + footer();
    window.CianKitDemo?.renderResults();
    loadTimer = setTimeout(() => finish(token), 3500);
  }
  function finish(token) {
    if (token !== run) return;
    const startHeight = results.getBoundingClientRect().height;
    results.style.height = startHeight + 'px';
    results.style.overflow = 'hidden';
    results.style.transition = 'none';
    results.removeAttribute('aria-busy');
    window.CianKitDemo?.unmountResults();
    results.innerHTML = data[mode].map(card).join('') + footer(false);
    window.CianKitDemo?.renderResults();
    const finalHeight = results.scrollHeight;
    const rows = Array.from(results.querySelectorAll('.row'));
    const cta = results.querySelector('.kit-matching');
    if (reducedMotion.matches) {
      cta.dataset.phase = 'ready';
      cta.removeAttribute('aria-label');
      window.CianKitDemo?.renderResults();
      resetMotion();
      return;
    }
    void results.offsetHeight;
    expansionFrame = requestAnimationFrame(() => {
      expansionFrame = undefined;
      if (token !== run) return;
      results.style.transition = 'height 650ms cubic-bezier(.4,0,.2,1)';
      results.style.height = finalHeight + 'px';
    });
    expansionTimer = setTimeout(() => {
      if (token !== run) return;
      results.style.removeProperty('height');
      results.style.removeProperty('overflow');
      results.style.removeProperty('transition');
    }, 680);
    rows.forEach((row, index) => {
      row.style.setProperty('--loading-delay', index * 100 + 'ms');
      row.style.setProperty('--loading-offset', index === 0 ? '0px' : '-12px');
      row.classList.add('loading-reveal');
    });
    const fadeDelay = Math.max(rows.length * 100, 700);
    fadeTimer = setTimeout(() => {
      if (token !== run) return;
      cta.dataset.phase = 'fade';
    }, fadeDelay);
    colorTimer = setTimeout(() => {
      if (token !== run) return;
      cta.dataset.phase = 'color';
      window.CianKitDemo?.renderResults();
    }, fadeDelay + 200);
    releaseTimer = setTimeout(() => {
      if (token !== run) return;
      cta.dataset.phase = 'ready';
      cta.removeAttribute('aria-label');
      window.CianKitDemo?.renderResults();
    }, fadeDelay + 550);
  }
  function setMode(next) {
    if (next === mode) return;
    mode = next;
    tabs.forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    results.setAttribute('aria-labelledby', mode === 'flats' ? 'flats-tab' : 'plans-tab');
    showLoading();
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const index = tabs.indexOf(tab);
      const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      setMode(next.dataset.mode);
      next.focus();
    });
  });
  showLoading();
})();
