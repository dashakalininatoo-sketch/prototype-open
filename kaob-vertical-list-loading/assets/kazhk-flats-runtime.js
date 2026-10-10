(() => {
  const database = window.KAZHK_FLATS_DATABASE;
  const card = document.querySelector('#card');
  if (!database || !card || card.dataset.flatsRuntime === 'ready') return;

  const section = card.querySelector('.kazhk-section:nth-of-type(3)');
  const tabs = [...section.querySelectorAll('.kazhk-tabs button')];
  const apartmentsTab = tabs.find(tab => tab.textContent.trim() === 'Квартиры');
  const plansTab = tabs.find(tab => tab.textContent.trim() === 'Планировки');
  if (apartmentsTab && plansTab) plansTab.before(apartmentsTab);
  const chips = [...section.querySelectorAll('.kazhk-chips .kazhk-chip')];
  const results = section.querySelector('.kazhk-plan-list');
  const cta = section.querySelector('.ds-button');
  const flats = database.flats;
  const PRICE_TOLERANCE = 50000;
  card.dataset.flatsRuntime = 'ready';

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
  const comma = value => new Intl.NumberFormat('ru-RU').format(value);
  const million = value => `${(value / 1e6).toFixed(1).replace('.', ',')} млн ₽`;
  const roomLabel = rooms => rooms === 0 ? 'Студия' : `${rooms}-комн. кв.`;
  const roomGroupLabel = rooms => rooms === 0 ? 'Студии' : `${rooms}-комнатные`;
  const planKey = flat => flat.layoutKey ? String(flat.layoutKey) : `offer-${flat.id}`;
  const plural = (count, single, few, many) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return single;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  };

  const readFilters = () => {
    const labels = chips.map(chip => chip.textContent.trim());
    const roomText = labels[0];
    const room = roomText === 'Студия' ? 0 : (roomText.match(/^(\d+)/)?.[1] ?? null);
    const priceText = labels[1];
    const maxPrice = priceText.match(/^До\s+(\d+(?:[.,]\d+)?)\s+млн/)?.[1];
    const minPrice = priceText.match(/^От\s+(\d+(?:[.,]\d+)?)\s+млн/)?.[1];
    const areaText = labels[2];
    const minArea = areaText.match(/^От\s+(\d+(?:[.,]\d+)?)\s+м²/)?.[1];
    const maxArea = areaText.match(/^До\s+(\d+(?:[.,]\d+)?)\s+м²/)?.[1];
    return {
      room: room === null ? null : Number(room),
      priceMin: minPrice ? Number(minPrice.replace(',', '.')) * 1e6 : null,
      priceMax: maxPrice ? Number(maxPrice.replace(',', '.')) * 1e6 : null,
      minArea: minArea ? Number(minArea.replace(',', '.')) : null,
      maxArea: maxArea ? Number(maxArea.replace(',', '.')) : null,
      building: labels[3].startsWith('Корпус ') ? labels[3] : null
    };
  };

  const matches = (filters, priceTolerance = PRICE_TOLERANCE) => flats.filter(flat =>
    (filters.room === null || flat.rooms === filters.room) &&
    (!filters.priceMin || flat.priceRub >= filters.priceMin) &&
    (!filters.priceMax || flat.priceRub <= filters.priceMax + priceTolerance) &&
    (!filters.minArea || flat.areaM2 >= filters.minArea) &&
    (!filters.maxArea || flat.areaM2 <= filters.maxArea) &&
    (!filters.building || flat.building === filters.building)
  );

  const sorted = items => [...items].sort((a, b) => a.priceRub - b.priceRub || a.areaM2 - b.areaM2);
  const priceLabel = delta => {
    if (delta < 1000) return `На ${Math.round(delta)} ₽ дороже`;
    if (delta < 100000) return `На ${Math.round(delta / 1000)} тыс ₽ дороже`;
    if (delta < 1000000) return `На ${Math.round(delta / 10000) * 10} тыс ₽ дороже`;
    return `На ${String(Math.round(delta / 100000) / 10).replace('.', ',')} млн ₽ дороже`;
  };
  const areaLabel = delta => {
    const rounded = Math.round((delta + Number.EPSILON) * 10) / 10;
    return `На ${String(rounded).replace('.', ',')} м² меньше`;
  };

  const cheaperLabel = delta => priceLabel(delta).replace('дороже', 'дешевле');
  const largerAreaLabel = delta => areaLabel(delta).replace('меньше', 'больше');
  const stepFor = (delta, boundaries) => boundaries.findIndex(value => delta <= value) + 1;
  const activeDimensionCount = filters => [
    filters.room !== null,
    filters.priceMin !== null || filters.priceMax !== null,
    filters.minArea !== null || filters.maxArea !== null,
    filters.building !== null
  ].filter(Boolean).length;

  const popularityScore = value => [...String(value)].reduce((score, char) => (score * 33 + char.charCodeAt(0)) >>> 0, 5381);

  const relevanceScore = (flat, filters) => {
    const scores = [];
    const weights = [];
    if (filters.priceMin !== null || filters.priceMax !== null) {
      let score = 1;
      if (filters.priceMin !== null && filters.priceMax !== null) {
        const middle = (filters.priceMin + filters.priceMax) / 2;
        const half = Math.max(1, (filters.priceMax - filters.priceMin) / 2);
        score = Math.max(0, 1 - Math.abs(flat.priceRub - middle) / half);
      } else if (filters.priceMax !== null) score = Math.max(0, 1 - flat.priceRub / Math.max(1, filters.priceMax + PRICE_TOLERANCE));
      else score = 1 / (1 + Math.abs(flat.priceRub - filters.priceMin) / Math.max(1, filters.priceMin));
      scores.push(score); weights.push(50);
    }
    if (filters.minArea !== null || filters.maxArea !== null) {
      let score = 1;
      if (filters.minArea !== null && filters.maxArea !== null) {
        const middle = (filters.minArea + filters.maxArea) / 2;
        const half = Math.max(.1, (filters.maxArea - filters.minArea) / 2);
        score = Math.max(0, 1 - Math.abs(flat.areaM2 - middle) / half);
      } else if (filters.maxArea !== null) score = 1 / (1 + Math.abs(filters.maxArea - flat.areaM2) / Math.max(1, filters.maxArea));
      else score = Math.min(flat.areaM2, filters.minArea * 1.2) / Math.max(1, filters.minArea * 1.2);
      scores.push(score); weights.push(25);
    }
    const weightTotal = weights.reduce((sum, value) => sum + value, 0);
    const relevance = weightTotal ? scores.reduce((sum, score, index) => sum + score * weights[index], 0) / weightTotal * 95 : 0;
    const quality = flat.planImage ? 5 : 0;
    return relevance + quality;
  };

  const byRelevance = filters => (a, b) => relevanceScore(b, filters) - relevanceScore(a, filters) || a.priceRub - b.priceRub || a.areaM2 - b.areaM2 || String(a.id).localeCompare(String(b.id));

  const prioritizedFlats = (items, filters, limit = 6) => {
    const available = [...items];
    const used = new Set();
    const result = [];
    const pick = (label, compare, eligible = () => true) => {
      const flat = available.filter(item => !used.has(String(item.id)) && eligible(item)).sort(compare)[0];
      if (!flat) return;
      used.add(String(flat.id));
      result.push({ flat, label });
    };
    pick('Самая низкая цена', (a, b) => a.priceRub - b.priceRub || String(a.id).localeCompare(String(b.id)));
    pick('Выгодная цена за м²', (a, b) => a.pricePerM2 - b.pricePerM2 || a.priceRub - b.priceRub);
    pick('Часто смотрят', (a, b) => popularityScore(b.id) - popularityScore(a.id));
    pick('Наибольшая площадь', (a, b) => b.areaM2 - a.areaM2 || a.priceRub - b.priceRub);
    pick('Ближайшая сдача', (a, b) => String(a.delivery).localeCompare(String(b.delivery), 'ru') || a.priceRub - b.priceRub);
    pick('Высокий этаж', (a, b) => b.floor / Number(b.floorsTotal) - a.floor / Number(a.floorsTotal) || b.floor - a.floor, flat => flat.floor / Number(flat.floorsTotal) >= .75);
    for (const flat of available.sort(byRelevance(filters))) {
      if (result.length >= limit) break;
      if (used.has(String(flat.id))) continue;
      used.add(String(flat.id));
      result.push({ flat, label: '' });
    }
    return result.slice(0, limit);
  };

  // Каждый кандидат нарушает только одно мягкое условие. Сначала берём разные
  // направления ослабления, затем добираем следующие лучшие варианты.
  const similarFlats = (filters, exact, limit) => {
    const exactIds = new Set(exact.map(flat => flat.id));
    const candidates = [];
    const add = (direction, items, meta) => items.forEach(flat => {
      if (exactIds.has(flat.id)) return;
      const data = meta(flat);
      if (data) candidates.push({ flat, direction, ...data });
    });
    if (filters.priceMax) add('priceMax', matches({ ...filters, priceMax: filters.priceMax + 1000000 }, 0).filter(flat => flat.priceRub > filters.priceMax + PRICE_TOLERANCE), flat => {
      const delta = flat.priceRub - filters.priceMax;
      return delta <= 1000000 ? { label: priceLabel(delta), step: stepFor(delta, [300000, 600000, 1000000]), relative: delta / filters.priceMax } : null;
    });
    if (filters.priceMin) add('priceMin', matches({ ...filters, priceMin: Math.max(0, filters.priceMin - 1000000) }).filter(flat => flat.priceRub < filters.priceMin), flat => {
      const delta = filters.priceMin - flat.priceRub;
      return delta <= 1000000 ? { label: cheaperLabel(delta), step: stepFor(delta, [300000, 600000, 1000000]), relative: delta / filters.priceMin } : null;
    });
    if (filters.minArea) add('minArea', matches({ ...filters, minArea: Math.max(0, filters.minArea - 15) }).filter(flat => flat.areaM2 < filters.minArea), flat => {
      const delta = filters.minArea - flat.areaM2;
      return delta <= 15 ? { label: areaLabel(delta), step: stepFor(delta, [5, 10, 15]), relative: delta / filters.minArea } : null;
    });
    if (filters.maxArea) add('maxArea', matches({ ...filters, maxArea: filters.maxArea + 10 }).filter(flat => flat.areaM2 > filters.maxArea), flat => {
      const delta = flat.areaM2 - filters.maxArea;
      return delta <= 10 ? { label: largerAreaLabel(delta), step: stepFor(delta, [5, 10]), relative: delta / filters.maxArea } : null;
    });
    if (filters.room !== null) add('room', matches({ ...filters, room: null }).filter(flat => Math.abs(flat.rooms - filters.room) === 1), flat => ({ label: flat.rooms < filters.room ? 'Меньше комнат' : 'Больше комнат', step: 1, relative: 1 / Math.max(1, filters.room) }));
    if (filters.building) add('building', matches({ ...filters, building: null }).filter(flat => flat.building !== filters.building), () => ({ label: 'В другом корпусе', step: 1, relative: 1 }));
    const compare = (a, b) => a.step - b.step || a.relative - b.relative || a.flat.priceRub - b.flat.priceRub || a.flat.areaM2 - b.flat.areaM2 || String(a.flat.id).localeCompare(String(b.flat.id));
    candidates.sort(compare);
    const result = [], usedIds = new Set(), usedDirections = new Set();
    const take = candidate => {
      if (!candidate || usedIds.has(candidate.flat.id) || result.length >= limit) return;
      usedIds.add(candidate.flat.id); usedDirections.add(candidate.direction); result.push(candidate);
    };
    candidates.forEach(candidate => { if (!usedDirections.has(candidate.direction)) take(candidate); });
    candidates.forEach(take);
    return result.slice(0, limit).map(({ flat, label }) => ({ flat, label }));
  };

  const groupPlans = items => {
    const grouped = new Map();
    items.forEach(flat => {
      const key = planKey(flat);
      if (!grouped.has(key)) grouped.set(key, { key, rooms: flat.rooms, flats: [] });
      grouped.get(key).flats.push(flat);
    });
    return [...grouped.values()].sort((a, b) => Math.min(...a.flats.map(x => x.priceRub)) - Math.min(...b.flats.map(x => x.priceRub)));
  };

  const prioritizedPlans = (groups, filters, limit = 6) => {
    const available = [...groups];
    const used = new Set();
    const result = [];
    const cheapestFlat = group => [...group.flats].sort((a, b) => a.priceRub - b.priceRub)[0];
    const pick = (label, compare) => {
      const group = available.filter(item => !used.has(item.key)).sort(compare)[0];
      if (!group) return;
      used.add(group.key);
      result.push({ group, label });
    };
    pick('Самая низкая цена', (a, b) => cheapestFlat(a).priceRub - cheapestFlat(b).priceRub || a.key.localeCompare(b.key));
    pick('Выгодная цена за м²', (a, b) => Math.min(...a.flats.map(x => x.pricePerM2)) - Math.min(...b.flats.map(x => x.pricePerM2)));
    pick('Часто смотрят', (a, b) => popularityScore(b.key) - popularityScore(a.key));
    pick('Наибольшая площадь', (a, b) => Math.max(...b.flats.map(x => x.areaM2)) - Math.max(...a.flats.map(x => x.areaM2)));
    pick('Больше вариантов', (a, b) => b.flats.length - a.flats.length || cheapestFlat(a).priceRub - cheapestFlat(b).priceRub);
    pick('Ближайшая сдача', (a, b) => String(cheapestFlat(a).delivery).localeCompare(String(cheapestFlat(b).delivery), 'ru') || cheapestFlat(a).priceRub - cheapestFlat(b).priceRub);
    for (const group of available.sort((a, b) => byRelevance(filters)(cheapestFlat(a), cheapestFlat(b)))) {
      if (result.length >= limit) break;
      if (used.has(group.key)) continue;
      used.add(group.key);
      result.push({ group, label: '' });
    }
    return result.slice(0, limit);
  };

  const similarPlans = (filters, exact, limit) => {
    const exactKeys = new Set(groupPlans(exact).map(group => group.key));
    const candidates = similarFlats(filters, exact, flats.length);
    const result = [];
    const usedKeys = new Set(exactKeys);
    for (const { flat, label } of candidates) {
      const key = planKey(flat);
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      const matching = candidates.filter(item => planKey(item.flat) === key).map(item => item.flat);
      result.push({ group: { key, rooms: flat.rooms, flats: matching }, label });
      if (result.length === limit) break;
    }
    return result;
  };

  const expandedFlats = (filters, exact) => {
    const exactIds = new Set(exact.map(flat => flat.id));
    const result = new Map();
    const add = items => items.forEach(flat => {
      if (!exactIds.has(flat.id)) result.set(flat.id, flat);
    });
    if (filters.priceMax) {
      const priceLimit = filters.priceMax + PRICE_TOLERANCE + 3 * 500000;
      add(matches({ ...filters, priceMax: priceLimit }, 0).filter(flat => flat.priceRub > filters.priceMax + PRICE_TOLERANCE));
    }
    if (filters.minArea) {
      const areaLimit = Math.max(0, filters.minArea - 3 * 5);
      add(matches({ ...filters, minArea: areaLimit }).filter(flat => flat.areaM2 < filters.minArea));
    }
    if (filters.room !== null && filters.room > 0) {
      const areaStepHasMatches = filters.minArea > 5 && matches({ ...filters, minArea: filters.minArea - 5 })
        .some(flat => flat.areaM2 < filters.minArea);
      const roomFilters = !areaStepHasMatches && filters.minArea
        ? { ...filters, room: filters.room - 1, minArea: Math.max(0, filters.minArea - 5) }
        : { ...filters, room: filters.room - 1 };
      add(matches(roomFilters));
    }
    if (filters.building) {
      add(matches({ ...filters, building: null }).filter(flat => flat.building !== filters.building));
    }
    return [...result.values()];
  };

  const expandedPlans = (filters, exact) => {
    const exactKeys = new Set(groupPlans(exact).map(group => group.key));
    const groups = new Map();
    expandedFlats(filters, exact).forEach(flat => {
      const key = planKey(flat);
      if (exactKeys.has(key) || groups.has(key)) return;
      groups.set(key, { key, rooms: flat.rooms, flats: flats.filter(item => planKey(item) === key) });
    });
    return [...groups.values()];
  };

  const image = flat => (flat.planImage || flat.previewImageUrl)
    ? `<img src="${escapeHtml(flat.planImage || flat.previewImageUrl)}" alt="${flat.planImage ? 'Планировка' : 'Изображение'} ${escapeHtml(flat.listingTitle)}">`
    : `<span class="kazhk-no-plan" aria-label="В источнике нет изображения планировки"></span>`;

  const planCard = (group, label = null) => {
    const cheapest = [...group.flats].sort((a, b) => a.priceRub - b.priceRub)[0];
    const minArea = Math.min(...group.flats.map(flat => flat.areaM2));
    return `<article class="kazhk-plan-row kazhk-data-row" data-plan="${escapeHtml(group.key)}" role="button" tabindex="0">
      ${image(cheapest)}
      <div>${label && label !== 'Лучшее совпадение' ? `<small class="kazhk-recommendation-label">${escapeHtml(label)}</small>` : ''}<b>${roomGroupLabel(group.rooms)}</b>
      <span>от ${million(cheapest.priceRub)} · от ${String(minArea).replace('.', ',')}&nbsp;м²</span>
      <button type="button">${group.flats.length} ${plural(group.flats.length, 'квартира', 'квартиры', 'квартир')}</button></div>
    </article>`;
  };

  const flatCard = (flat, label = null) => `<article class="kazhk-plan-row kazhk-data-row" data-flat-id="${escapeHtml(flat.id)}" role="button" tabindex="0">
    ${image(flat)}
    <div>${label && label !== 'Лучшее совпадение' ? `<small class="kazhk-recommendation-label">${escapeHtml(label)}</small>` : ''}<b>${comma(flat.priceRub)} ₽${flat.oldPriceRub ? ` <s>${comma(flat.oldPriceRub)} ₽</s>` : ''}</b>
    <span>${roomLabel(flat.rooms)} · ${String(flat.areaM2).replace('.', ',')}&nbsp;м² · ${flat.floor}/${flat.floorsTotal} этаж</span>
    <span class="kazhk-delivery">Сдача: ${escapeHtml(flat.delivery || 'не указана')}</span>
    </div>
  </article>`;

  const setChipStates = filters => chips.forEach((chip, index) => {
    const checked = [filters.room !== null, filters.priceMin !== null || filters.priceMax !== null, filters.minArea !== null || filters.maxArea !== null, filters.building !== null][index];
    chip.classList.toggle('active', checked);
    chip.setAttribute('aria-pressed', String(checked));
  });

  const render = (limit = 6) => {
    const filters = readFilters();
    const selected = matches(filters).sort((a, b) => a.priceRub - b.priceRub);
    const plansMode = tabs.find(tab => tab.classList.contains('active'))?.textContent.trim() === 'Планировки';
    setChipStates(filters);

    if (plansMode) {
      const exact = groupPlans(selected);
      const broad = activeDimensionCount(filters) <= 2 && exact.length > limit;
      const prioritized = broad ? prioritizedPlans(exact, filters, limit) : [];
      const exactVisible = broad
        ? prioritized
        : exact.slice().sort((a, b) => byRelevance(filters)(a.flats[0], b.flats[0])).slice(0, limit).map(group => ({ group, label: '' }));
      const recommendationLimit = exact.length >= limit ? 0 : exact.length >= 4 ? 2 : 3;
      const alternatives = recommendationLimit ? similarPlans(filters, selected, recommendationLimit) : [];
      const title = exact.length === 0
        ? `<h3 class="kazhk-results-title">По вашему запросу ничего не найдено</h3>`
        : exact.length < limit
          ? `<h3 class="kazhk-results-title">${exact.length} ${plural(exact.length, 'подходящая планировка', 'подходящие планировки', 'подходящих планировок')}</h3>`
          : '';
      results.innerHTML = `${title}${exactVisible.map(item => planCard(item.group, item.label)).join('')}${alternatives.length ? `<h3 class="kazhk-results-title">Похожи на ваш запрос</h3>${alternatives.map(item => planCard(item.group, item.label)).join('')}` : ''}`;
      const total = exact.length + alternatives.length;
      cta.hidden = total === 0;
      cta.textContent = exact.length >= limit
        ? `${exact.length} ${plural(exact.length, 'подходящая планировка', 'подходящие планировки', 'подходящих планировок')}`
        : `Подобрали ${total} ${plural(total, 'планировку', 'планировки', 'планировок')}`;
      return;
    }

    const broad = activeDimensionCount(filters) <= 2 && selected.length > limit;
    const exactVisible = broad
      ? prioritizedFlats(selected, filters, limit)
      : selected.slice().sort(byRelevance(filters)).slice(0, limit).map(flat => ({ flat, label: '' }));
    const recommendationLimit = selected.length >= limit ? 0 : selected.length >= 4 ? 2 : 3;
    const alternatives = recommendationLimit ? similarFlats(filters, selected, recommendationLimit) : [];
    const title = selected.length === 0
      ? `<h3 class="kazhk-results-title">По вашему запросу ничего не найдено</h3>`
      : selected.length < limit
        ? `<h3 class="kazhk-results-title">${selected.length} ${plural(selected.length, 'подходящая квартира', 'подходящие квартиры', 'подходящих квартир')}</h3>`
        : '';
    results.innerHTML = `${title}${exactVisible.map(item => flatCard(item.flat, item.label)).join('')}${alternatives.length ? `<h3 class="kazhk-results-title">Похожи на ваш запрос</h3>${alternatives.map(item => flatCard(item.flat, item.label)).join('')}` : ''}`;
    const total = selected.length + alternatives.length;
    cta.hidden = total === 0;
    cta.textContent = selected.length >= limit
      ? `${selected.length} ${plural(selected.length, 'подходящая квартира', 'подходящие квартиры', 'подходящих квартир')}`
      : `Подобрали ${total} ${plural(total, 'квартиру', 'квартиры', 'квартир')}`;
  };

  const style = document.createElement('style');
  style.id = 'kazhk-real-flats-styles';
  style.textContent = `
    #card .kazhk-section .ds-button[hidden]{display:none!important}
    #card .kazhk-data-results{gap:16px}
    #card .kazhk-results-title{margin:0;color:var(--ds-color-text-primary-default);font:600 16px/20px var(--ds-font-family);letter-spacing:-.32px}
    #card .kazhk-data-row{min-height:80px}
    #card .kazhk-data-row>b s{margin-left:4px;color:var(--ds-color-text-secondary-default);font:400 14px/17px var(--ds-font-family)}
    #card .kazhk-delivery{color:var(--ds-color-text-secondary-default)}
    #card .kazhk-recommendation-label{display:block;margin-bottom:4px;color:var(--ds-color-text-positive-default);font:400 12px/15px var(--ds-font-family);letter-spacing:0}
    #card .kazhk-no-plan{display:block;width:80px;height:80px;border-radius:var(--ds-radius-l);background:#fff;box-shadow:inset 0 0 0 1px rgba(13,22,46,.04)}
    #card .kazhk-plan-list[aria-busy="true"]{gap:16px;--surface-neutral-default:var(--ds-color-surface-neutral-default);--surface-inverted-default:var(--ds-color-brand-white);--stroke-border-neutral:var(--ds-color-surface-neutral-default)}
    #card .kazhk-loading-row{display:grid;grid-template-columns:80px minmax(0,1fr);gap:12px;min-height:80px;align-items:center}
    #card .kazhk-loading-photo{width:80px;height:80px;border:1px solid var(--stroke-border-neutral);border-radius:var(--ds-radius-l);background:var(--surface-neutral-default)}
    #card .kazhk-loading-copy{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-width:0}
    #card .kazhk-loading-bar{display:block;max-width:100%;background:var(--surface-neutral-default);overflow:hidden;position:relative}
    #card .kazhk-loading-bar:nth-child(1){width:122px;height:12px;border-radius:12px}
    #card .kazhk-loading-bar:nth-child(2){width:152px;height:20px;border-radius:8px}
    #card .kazhk-loading-bar:nth-child(3){width:212px;height:12px;border-radius:12px}
    #card .kazhk-loading-photo,#card .kazhk-loading-bar{position:relative;overflow:hidden}
    #card .kazhk-loading-photo::after,#card .kazhk-loading-bar::after{content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent 0%,var(--surface-inverted-default) 60%,transparent 100%);animation:kazhk-loading-shimmer 1.35s linear infinite}
    @keyframes kazhk-loading-shimmer{to{transform:translateX(100%)}}
    #card .kazhk-loading-button:disabled{opacity:1;cursor:default}
    #card .kazhk-loading-spinner{display:block;width:24px;height:24px;animation:kazhk-loading-spin 2s linear infinite}
    @keyframes kazhk-loading-spin{to{transform:rotate(360deg)}}
    #card .kazhk-results-revealing .kazhk-data-row{animation:kazhk-result-appear .25s cubic-bezier(.5,0,.2,1) both;animation-delay:var(--reveal-delay)}
    #card .kazhk-loaded-cta-label{display:inline-block;animation:kazhk-cta-text-in .25s ease-out both}
    @keyframes kazhk-cta-text-in{from{opacity:0}to{opacity:1}}
    @keyframes kazhk-result-appear{from{opacity:0;transform:translateY(var(--reveal-offset,0px))}to{opacity:1;transform:translateY(0)}}
    @media (prefers-reduced-motion:reduce){#card .kazhk-loading-photo::after,#card .kazhk-loading-bar::after,#card .kazhk-loading-spinner,#card .kazhk-results-revealing .kazhk-data-row,#card .kazhk-loaded-cta-label{animation:none}}

  `;
  document.head.append(style);
  let loading = true;
  let loadingTimer = null;
  let revealTimer = null;
  let ctaReadyTimer = null;
  let expansionFrame = null;
  let collapseTimer = null;
  let pendingCtaText = null;
  const cancelReveal = () => {
    clearTimeout(revealTimer);
    clearTimeout(ctaReadyTimer);
    clearTimeout(collapseTimer);
    collapseTimer = null;
    if (expansionFrame !== null) cancelAnimationFrame(expansionFrame);
    expansionFrame = null;
    results.style.removeProperty('height');
    results.style.removeProperty('overflow');
    results.style.removeProperty('transition');
    results.classList.remove('kazhk-results-revealing');
    if (pendingCtaText !== null) cta.textContent = pendingCtaText;
    pendingCtaText = null;
    cta.classList.remove('kazhk-loading-button');
    cta.removeAttribute('aria-label');
    cta.disabled = false;
  };
  const showLoading = (animateLayout = false) => {
    const previousHeight = animateLayout ? results.getBoundingClientRect().height : 0;
    cancelReveal();
    clearTimeout(loadingTimer);
    loadingTimer = null;
    loading = true;
    results.setAttribute('aria-busy', 'true');
    results.innerHTML = Array.from({ length: 3 }, () => `
      <div class="kazhk-loading-row" aria-hidden="true">
        <span class="kazhk-loading-photo"></span>
        <span class="kazhk-loading-copy"><span class="kazhk-loading-bar"></span><span class="kazhk-loading-bar"></span><span class="kazhk-loading-bar"></span></span>
      </div>`).join('');
    cta.hidden = false;
    cta.disabled = true;
    cta.classList.add('kazhk-loading-button');
    cta.setAttribute('aria-label', 'Загружаем квартиры и планировки');
    cta.innerHTML = '<img class="kazhk-loading-spinner" src="assets/figma-loading-spinner.svg" width="24" height="24" alt="">';
    if (animateLayout && previousHeight && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const skeletonHeight = results.scrollHeight;
      results.style.height = `${previousHeight}px`;
      results.style.overflow = 'hidden';
      results.style.transition = 'none';
      void results.offsetHeight;
      expansionFrame = requestAnimationFrame(() => {
        expansionFrame = null;
        results.style.transition = 'height 350ms cubic-bezier(.4,0,.2,1)';
        results.style.height = `${skeletonHeight}px`;
      });
      collapseTimer = setTimeout(() => {
        results.style.removeProperty('height');
        results.style.removeProperty('overflow');
        results.style.removeProperty('transition');
        collapseTimer = null;
      }, 400);
    }
  };
  const finishLoading = (animate = true) => {
    if (!loading) return;
    loading = false;
    clearTimeout(loadingTimer);
    loadingTimer = null;
    const startHeight = results.getBoundingClientRect().height;
    results.style.height = `${startHeight}px`;
    results.style.overflow = 'hidden';
    results.style.transition = 'none';
    results.removeAttribute('aria-busy');
    const spinnerMarkup = cta.innerHTML;
    render(5);
    const finalHeight = results.scrollHeight;
    const rows = [...results.querySelectorAll('.kazhk-data-row')];
    if (!animate || !rows.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelReveal();
      return;
    }
    pendingCtaText = cta.textContent;
    cta.innerHTML = spinnerMarkup;
    cta.disabled = true;
    void results.offsetHeight;
    expansionFrame = requestAnimationFrame(() => {
      expansionFrame = null;
      results.style.transition = 'height 650ms cubic-bezier(.4,0,.2,1)';
      results.style.height = `${finalHeight}px`;
    });
    results.classList.add('kazhk-results-revealing');
    rows.forEach((row, index) => {
      row.style.setProperty('--reveal-delay', `${index * 100}ms`);
      row.style.setProperty('--reveal-offset', index === 0 ? '0px' : '-12px');
    });
    revealTimer = setTimeout(() => {
      const label = document.createElement('span');
      label.className = 'kazhk-loaded-cta-label';
      label.textContent = pendingCtaText;
      cta.replaceChildren(label);
      pendingCtaText = null;
      cta.classList.remove('kazhk-loading-button');
      cta.removeAttribute('aria-label');
      ctaReadyTimer = setTimeout(cancelReveal, 250);
    }, rows.length * 100);
  };
  const updateResults = () => {
    if (loading) finishLoading(false);
    else { cancelReveal(); render(); }
  };
  let activeTab = tabs.find(tab => tab.classList.contains('active'));
  tabs.forEach(tab => tab.addEventListener('click', () => setTimeout(() => {
    const nextTab = tabs.find(item => item.classList.contains('active'));
    if (!nextTab || nextTab === activeTab) return;
    activeTab = nextTab;
    showLoading(true);
    beginLoading();
  }, 0)));
  card.addEventListener('click', event => {
    if (event.target.closest('.kazhk-sheet-apply') || event.target.closest('.kazhk-sheet-reset')) {
      setTimeout(updateResults, 0);
    }
  });

  // The loading demo starts with the Apartments tab and the 15m budget.
  tabs.forEach(tab => {
    const active = tab === apartmentsTab;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  activeTab = apartmentsTab;
  chips[1].firstChild.nodeValue = 'До 15 млн ₽';
  render();
  showLoading();

  const beginLoading = () => {
    if (!loading || loadingTimer) return;
    loadingTimer = setTimeout(finishLoading, 3500);
  };
  const scroll = card.querySelector('.kazhk-scroll');
  if ('IntersectionObserver' in window && scroll) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        beginLoading();
      }
    }, { root: scroll, threshold: 0.1 });
    observer.observe(section);
  } else beginLoading();
})();
