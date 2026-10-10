/* Content adapter for the independent Lesnaya Kollekciya snapshot. */
(() => {
  const db = window.KAZHK_FLATS_DATABASE;
  if (!db || !db.complex || !db.flats?.length) return;
  const c = db.complex;
  const flats = db.flats;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const million = amount => `${(amount / 1e6).toLocaleString('ru-RU', {maximumFractionDigits: 2})} млн ₽`;
  const rub = amount => `${Number(amount).toLocaleString('ru-RU')} ₽`;
  const range = `${million(c.minPriceRub)}–${million(c.maxPriceRub)}`.replace(' млн ₽–', '–');
  const image = index => c.gallery[index].local;
  const localOffers = flats.length;
  const plans = new Set(flats.map(f => f.layoutKey ? String(f.layoutKey) : `offer-${f.id}`)).size;

  gallerySets[0] = {name: c.name, price: range, photos: c.gallery.map(photo => photo.local)};
  projects[0].name = c.name;
  projects[0].price = range;
  projects[0].img = image(0);
  projects[0].facts = [
    ['icon-calendar.svg', 'Сдача во 2 квартале 2029 года', 'Пять корпусов'],
    ['icon-pin.svg', 'Метро «Планерная»', '9 минут на транспорте'],
    ['icon-height-floor.svg', 'Потолки 2,85 м', 'Квартиры без отделки'],
    ['icon-sale.svg', 'Скидка до 25%', 'До 30 сентября 2026 года'],
    ['icon-installment.svg', 'Ипотека 8% на первый год', 'До 30 сентября 2026 года']
  ];
  projects[0].features = [
    'Пять 25-этажных корпусов бизнес-класса',
    'Закрытый двор площадью 6 га',
    'В проекте предусмотрены детские и спортивные площадки',
    'До метро «Планерная» — 9 минут на транспорте',
    'Квартиры без отделки, высота потолков 2,85 м'
  ];
  cardProjects[0] = {
    coverSub: 'Сдача 2 кв. 2029, бизнес',
    offers: `${localOffers} предложений в выборке`,
    plans: `${plans} вариантов`,
    mortgage: 'Ипотека 8% в первый год',
    rating: '4,8', price: range,
    pricePerMeter: `${rub(Math.min(...flats.map(f => f.pricePerM2)))}–${rub(Math.max(...flats.map(f => f.pricePerM2)))} / м²`,
    address: c.address, metro: 'Планерная', travel: '9 мин. на транспорте'
  };
  const listingRow = flat => [
    `${flat.rooms}-комн.кв.`, flat.areaM2, `${flat.floor}/${flat.floorsTotal}`,
    rub(flat.priceRub), flat.planImage || flat.previewImageUrl
  ];
  const byRoom = rooms => flats.filter(flat => flat.rooms === rooms).map(listingRow);
  const all = flats.map(listingRow);
  listingCatalog[0] = {
    developer: c.developer, developerCount: localOffers, agentCount: 0,
    rating: '★ 4,8', metro: 'Планерная', travel: '9 мин. на транспорте',
    completion: c.delivery, badge: 'Скидка до 25%',
    one: byRoom(1), two: byRoom(2), extra: byRoom(3), all
  };

  // The first column belongs to this complex; the other two comparison projects stay as in the source flow.
  firstCell(0, 0).textContent = c.delivery;
  firstCell(0, 1).textContent = `От ${rub(Math.min(...flats.map(f => f.pricePerM2)))}/м²`;
  firstCell(0, 2).querySelector('.metric-badge').lastChild.textContent = '—';
  firstCell(1, 0).textContent = `${localOffers} в продаже`;
  firstCell(1, 1).querySelector('.metric-badge').lastChild.textContent = '—';
  const roomCell = (rooms, row) => {
    const group = flats.filter(f => f.rooms === rooms);
    if (!group.length) return;
    firstCell(1, row).innerHTML = `<span class="flat-link">${rooms}-комнатные</span><span>${million(Math.min(...group.map(f => f.priceRub)))}–${million(Math.max(...group.map(f => f.priceRub)))}</span><span class="muted-line">От ${String(Math.min(...group.map(f => f.areaM2))).replace('.', ',')} м²</span>`;
  };
  roomCell(1, 2); roomCell(2, 3); roomCell(3, 4);
  firstCell(1, 7).textContent = 'Нет в продаже';
  const developer = firstCell(2, 0);
  developer.querySelector('img').src = c.developerLogo.local;
  developer.querySelector('img').alt = c.developer;
  developer.querySelector('strong').textContent = c.developer;
  developer.querySelector('span:last-child').textContent = 'Застройщик';
  firstCell(2, 1).textContent = 'Нет данных';
  firstCell(2, 2).textContent = 'Нет данных';
  const otherDeveloper = comparisonSections[2].querySelectorAll('.columns')[0].children[2];
  otherDeveloper.querySelector('img').removeAttribute('src');
  otherDeveloper.querySelector('img').style.display = 'none';
  otherDeveloper.querySelector('strong').textContent = 'Level Group';
  otherDeveloper.querySelector('span:last-child').textContent = 'Застройщик';
  firstCell(3, 1).textContent = 'Квартиры';
  firstCell(3, 2).textContent = c.finish;
  firstCell(3, 3).textContent = c.buildingType;
  firstCell(3, 4).textContent = `${c.buildingCount} корпусов, ${c.buildingFloors} этажей`;
  firstCell(3, 5).textContent = '2,85 м';
  firstCell(4, 0).textContent = c.address;
  firstCell(4, 1).innerHTML = '<span class="metro-line"><img src="assets/ui-metro-1.svg" alt="">Планерная</span>';
  firstCell(4, 2).innerHTML = '<span class="distance-line"><img src="assets/ui-walk.svg" alt="">9 мин. на транспорте</span>';
  firstCell(5, 0).textContent = 'Подземная';
  firstCell(5, 1).innerHTML = 'Детские площадки<br>Спортивные площадки<br>Места для отдыха';
  firstCell(5, 2).innerHTML = '<span>Район ЖК «Лесная Коллекция»</span><span class="infra-map">На карте</span>';
  firstCell(6, 0).innerHTML = 'Скидка до 25%<br>Ипотека 8% на первый год';
  const firstComplex = $$('.complex-card')[0];
  firstComplex.querySelector('.complex-photo>img').src = image(0);
  firstComplex.querySelector('.complex-photo>img').alt = c.name;
  firstComplex.querySelector('.complex-name').textContent = c.name;
  firstComplex.querySelector('.complex-price').textContent = range;
  firstComplex.querySelector('.complex-rating').innerHTML = '<img src="assets/ui-star-12.svg" alt="">4,8';
  const compareGallery = $$('.gallery-cell')[0];
  compareGallery.querySelector(':scope>img').src = image(1);
  compareGallery.querySelector(':scope>img').alt = `Галерея ${c.name}`;
  compareGallery.querySelector('.photo-count').lastChild.textContent = `${c.gallery.length} фото`;
  const sticky = $$('.sticky-card')[0];
  sticky.querySelector('.sticky-project').childNodes[0].nodeValue = c.name;
  sticky.querySelector('.sticky-project b').textContent = range;
  $$('.map-pin-label')[0].querySelector('span:last-child').textContent = c.name;
  const glassNotes = $$('.glass-pill small');
  if (glassNotes[0]) glassNotes[0].textContent = `${localOffers} предложений в выборке`;
  if (glassNotes[1]) glassNotes[1].textContent = `${plans} вариантов`;
  const priceTrend = comparisonSections[0].querySelectorAll('.trend-cell')[0];
  priceTrend.lastElementChild.textContent = 'Нет данных';
  const saleTrend = comparisonSections[1].querySelectorAll('.trend-cell')[0];
  saleTrend.lastElementChild.textContent = 'Нет данных';
  $('#infraImage').src = 'assets/lesnaya-kollekciya/location-map.png';
  $('#infraImage').alt = `Карта района ЖК «${c.name}»`;
  $('.infra-caption').textContent = c.name;
  $('#galleryPhoto').src = image(0);
  $('#galleryName').textContent = c.name;
  $('#galleryPrice').textContent = range;

  const card = $('#card');
  const gallery = $$('#card .kazhk-gallery .kazhk-photo>img');
  gallery[0].src = image(0); gallery[1].src = image(1);
  card.querySelector('.kazhk-count').textContent = `1 из ${c.gallery.length}`;
  const badge = card.querySelector('.kazhk-badge.star');
  badge.lastChild.textContent = '4,8';
  const factualBadges = $$('#card .kazhk-badge:not(.star)');
  if (factualBadges[0]) factualBadges[0].textContent = 'Бизнес-класс';
  if (factualBadges[1]) factualBadges[1].textContent = '5 корпусов';
  card.querySelector('.kazhk-title h1').textContent = c.displayName;
  card.querySelector('.kazhk-title-main p').textContent = `Сдача ${c.delivery}, бизнес`;
  card.querySelector('.kazhk-price b').textContent = range;
  card.querySelector('.kazhk-price p:nth-child(2)').textContent = `${rub(Math.min(...flats.map(f => f.pricePerM2)))}–${rub(Math.max(...flats.map(f => f.pricePerM2)))} / м²`;
  card.querySelector('.kazhk-address p').textContent = c.address;
  card.querySelector('.kazhk-transit span:first-child').lastChild.textContent = 'Планерная';
  card.querySelector('.kazhk-transit span:last-child img').src = 'assets/design-system/icons/16/Bus.svg';
  card.querySelector('.kazhk-transit span:last-child').lastChild.textContent = '9 мин.';
  card.querySelector('.kazhk-map').src = 'assets/mapIcon.png';
  const promoCards = $$('#card .kazhk-promo');
  promoCards[0].querySelector('b').textContent = 'Скидка до 25%';
  promoCards[1].querySelector('b').textContent = 'Ипотека 8% на первый год';
  promoCards.slice(0, 2).forEach(promo => promo.querySelector('span').textContent = 'До 30 сентября');
  promoCards.slice(2).forEach(promo => promo.remove());
  card.querySelector('.kazhk-genplan>img').src = c.genplan.local;
  const labels = $$('#card .kazhk-label');
  labels[0].innerHTML = '<b>1</b>Корпус'; labels[1].innerHTML = '<b>2</b>Корпус';
  card.querySelector('.kazhk-sticky-title').textContent = c.displayName;
  card.querySelector('.kazhk-actions button[aria-label="Сравнить"]').addEventListener('click', () => {
    show('comparison');
    $('#compareScroll').scrollTop = 0;
  });
})();
