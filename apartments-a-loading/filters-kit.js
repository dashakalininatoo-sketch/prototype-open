/* Actual Button and IconChevronDownSmall16 components from the local Cian UI Kit.
   The loading demo keeps all filters presentational; only the two tabs switch views. */
(() => {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const Kit = window.CianUiKit;
  const mount = document.querySelector('#kit-filters');
  if (!React || !ReactDOM || !Kit || !mount) return;

  const h = React.createElement;
  const chevron = () => h(Kit.IconChevronDownSmall16, { color: 'icon-primary-default' });
  const button = (label, selected, className, withChevron = false) =>
    h('span', { className: `kit-filter ${className}${selected ? ' selected' : ''}`, key: label },
      h(Kit.Button, {
        theme: selected ? 'main_secondary' : 'inverted',
        size: 'M',
        type: 'button',
        tabIndex: -1,
        'aria-disabled': 'true',
        afterIcon: withChevron ? chevron() : undefined,
      }, label));

  ReactDOM.createRoot(mount).render(
    h(Kit.UiKitRoot, { theme: 'light', displayContents: true },
      h('div', { className: 'kit-filter-row' },
        h('div', { className: 'kit-rooms' },
          ['Студия', '1-комн.', '2', '3', '4', '5+'].map((label, index) =>
            button(label, index === 1, `room room-${index}`))),
        button('До 15 млн ₽', true, 'price-filter', true),
        button('От 34 м²', true, 'area-filter', true),
        button('Срок сдачи, Корпус', false, 'building-filter', true))));

  let resultsRoot;
  let resultsHost;
  function unmountResults() {
    if (resultsRoot) resultsRoot.unmount();
    resultsHost?.remove();
    resultsRoot = undefined;
    resultsHost = undefined;
  }
  function renderResults() {
    const portals = [];
    const pagination = document.querySelector('#results .kit-pagination');
    if (pagination) {
      const pageButton = (label, disabled = false, icon = false) =>
        h(Kit.Button, {
          key: label,
          theme: 'stroke_secondary',
          size: 'XS',
          type: 'button',
          disabled,
          tabIndex: -1,
          'aria-disabled': 'true',
          afterIcon: icon ? h(Kit.IconMore16, { color: 'icon-primary-default' }) : undefined,
        }, icon ? undefined : label);
      portals.push(ReactDOM.createPortal(
        h(React.Fragment, null,
          pageButton('Назад', true),
          pageButton('1', true),
          ...['2', '3', '4', '5', '6'].map(label => pageButton(label)),
          pageButton('Ещё', false, true),
          pageButton('Дальше')),
        pagination, 'pagination'));
    }
    const matching = document.querySelector('#results .kit-matching');
    if (matching) {
      const phase = matching.dataset.phase;
      const spinnerVisible = phase === 'loading' || phase === 'fade';
      portals.push(ReactDOM.createPortal(
        h(Kit.Button, {
          theme: spinnerVisible ? 'main_secondary' : 'main_primary',
          size: 'M',
          type: 'button',
          loading: spinnerVisible,
          disabled: spinnerVisible,
          tabIndex: -1,
          'aria-disabled': 'true',
        }, matching.dataset.label),
        matching, 'matching'));
    }
    document.querySelectorAll('#results .kit-actions').forEach((target, index) => {
      portals.push(ReactDOM.createPortal(h(React.Fragment, null,
        h('span', { className: 'icon-button' }, h(Kit.IconCompareAdd24, { color: 'icon-primary-default' })),
        h('span', { className: 'icon-button' }, h(Kit.IconHeartOff24, { color: 'icon-primary-default' }))),
      target, `actions-${index}`));
    });
    if (!portals.length) { unmountResults(); return; }
    if (!resultsRoot) {
      resultsHost = document.createElement('div');
      resultsHost.hidden = true;
      document.body.append(resultsHost);
      resultsRoot = ReactDOM.createRoot(resultsHost);
    }
    ReactDOM.flushSync(() => resultsRoot.render(
      h(Kit.UiKitRoot, { theme: 'light', displayContents: true }, portals)));
  }
  window.CianKitDemo = { renderResults, unmountResults };
})();
