(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("PerformanceVAS", ["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React);
    global.PerformanceVAS = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _react) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PromotionModal = PromotionModal;
  _react = _interopRequireWildcard(_react);
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  const AssetBase = /*#__PURE__*/_react.default.createContext('assets/');
  function useAsset() {
    const base = (0, _react.useContext)(AssetBase);
    return name => (base.endsWith('/') ? base : base + '/') + name;
  }
  function Icon({
    file,
    size = 16
  }) {
    const asset = useAsset();
    return /*#__PURE__*/_react.default.createElement("img", {
      className: "icon",
      alt: "",
      width: size,
      height: size,
      src: asset(file)
    });
  }
  function Modal({
    children,
    onClose,
    small = false,
    label
  }) {
    const ref = (0, _react.useRef)(null),
      timer = (0, _react.useRef)(null);
    (0, _react.useLayoutEffect)(() => {
      const dialog = ref.current;
      dialog.showModal();
      return () => {
        clearTimeout(timer.current);
        dialog.close();
      };
    }, []);
    function close() {
      if (timer.current) return;
      ref.current.classList.add('closing');
      timer.current = setTimeout(onClose, 130);
    }
    return /*#__PURE__*/_react.default.createElement("dialog", {
      ref: ref,
      "aria-label": label,
      className: small ? 'small' : '',
      onCancel: e => {
        e.preventDefault();
        e.stopPropagation();
        close();
      },
      onClick: e => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
        }
      }
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "close",
      "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
      onClick: close
    }, /*#__PURE__*/_react.default.createElement(Icon, {
      file: "close.svg",
      size: 12
    })), children);
  }
  const dateKey = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  const fromKey = s => new Date(s + 'T12:00:00');
  const dayText = s => fromKey(s).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  function periodText(d) {
    if (!d) return 'Все свободные';
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      ...(d[0].slice(0, 4) !== d[1].slice(0, 4) ? {
        year: 'numeric'
      } : {})
    }).formatRange(fromKey(d[0]), fromKey(d[1]));
  }
  function Calendar({
    dates,
    save,
    cancel
  }) {
    const today = dateKey(new Date()),
      seed = fromKey(dates?.[0] || today);
    const [month, setMonth] = (0, _react.useState)(new Date(seed.getFullYear(), seed.getMonth(), 1));
    const [start, setStart] = (0, _react.useState)(dates?.[0]),
      [end, setEnd] = (0, _react.useState)(dates?.[1]);
    const shift = n => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
    function pick(key) {
      if (!start || end) {
        setStart(key);
        setEnd(null);
      } else if (key < start) {
        setStart(key);
      } else setEnd(key);
    }
    return /*#__PURE__*/_react.default.createElement(Modal, {
      label: "\u041F\u0435\u0440\u0438\u043E\u0434 \u043F\u0440\u043E\u0436\u0438\u0432\u0430\u043D\u0438\u044F",
      small: true,
      onClose: cancel
    }, /*#__PURE__*/_react.default.createElement("h2", null, "\u041F\u0435\u0440\u0438\u043E\u0434 \u043F\u0440\u043E\u0436\u0438\u0432\u0430\u043D\u0438\u044F"), /*#__PURE__*/_react.default.createElement("p", {
      className: "muted"
    }, !start ? 'Выберите первый день' : !end ? 'Выберите последний день' : periodText([start, end])), /*#__PURE__*/_react.default.createElement("div", {
      className: "month"
    }, /*#__PURE__*/_react.default.createElement("button", {
      "aria-label": "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446",
      disabled: dateKey(month).slice(0, 7) <= today.slice(0, 7),
      onClick: () => shift(-1)
    }, "\u2039"), /*#__PURE__*/_react.default.createElement("b", null, month.toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric'
    })), /*#__PURE__*/_react.default.createElement("button", {
      "aria-label": "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446",
      onClick: () => shift(1)
    }, "\u203A")), /*#__PURE__*/_react.default.createElement("div", {
      className: "calendar"
    }, ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(x => /*#__PURE__*/_react.default.createElement("small", {
      key: x
    }, x)), Array.from({
      length: (month.getDay() + 6) % 7
    }, (_, i) => /*#__PURE__*/_react.default.createElement("span", {
      key: 's' + i
    })), Array.from({
      length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    }, (_, i) => {
      const key = dateKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
      return /*#__PURE__*/_react.default.createElement("button", {
        key: key,
        "aria-label": dayText(key),
        className: key === start || key === end ? 'picked' : start < key && key < end ? 'between' : '',
        disabled: key < today,
        onClick: () => pick(key)
      }, i + 1);
    })), /*#__PURE__*/_react.default.createElement("button", {
      className: "primary",
      disabled: !end || start < today,
      onClick: () => save([start, end])
    }, "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0435\u0440\u0438\u043E\u0434"));
  }
  function Listing() {
    const asset = useAsset();
    return /*#__PURE__*/_react.default.createElement("section", {
      className: "listing card"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "photo"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: asset('391d4.png'),
      alt: "\u0418\u043D\u0442\u0435\u0440\u044C\u0435\u0440 \u043A\u0432\u0430\u0440\u0442\u0438\u0440\u044B"
    })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h2", null, "3-\u043A\u043E\u043C\u043D. \u043A\u0432., 70 \u043C\xB2"), /*#__PURE__*/_react.default.createElement("div", {
      className: "address"
    }, "\u041C\u043E\u0441\u043A\u0432\u0430, \u0417\u0435\u043B\u0410\u041E, \u0440-\u043D \u041A\u0440\u044E\u043A\u043E\u0432\u043E", /*#__PURE__*/_react.default.createElement("br", null), "\u043C. \u0420\u0435\u0447\u043D\u043E\u0439 \u0432\u043E\u043A\u0437\u0430\u043B"), /*#__PURE__*/_react.default.createElement("b", {
      className: "price"
    }, /*#__PURE__*/_react.default.createElement("i", null, /*#__PURE__*/_react.default.createElement(Icon, {
      file: "a4eee.svg"
    })), "7 800 \u20BD")));
  }
  const formatNumber = new Intl.NumberFormat('ru-RU');
  const plural = new Intl.PluralRules('ru');
  function quantity(n, forms) {
    return n + ' ' + forms[{
      one: 0,
      few: 1,
      many: 2
    }[plural.select(n)] ?? 2];
  }
  function model(rate, dates) {
    const days = dates ? Math.min(30, 1 + (Date.parse(dates[1]) - Date.parse(dates[0])) / 86400000) : 30;
    const scale = bookings => Math.min(Math.floor(days / 2), Math.round(bookings * days / 30));
    const organic = scale(4);
    const bookings = scale(Math.round(4 + rate * 8 / 15));
    return {
      days,
      organic,
      bookings,
      extra: bookings - organic,
      nights: 2 * bookings
    };
  }
  function AnimatedNumber({
    value,
    signed = false,
    currency = false
  }) {
    const [display, setDisplay] = (0, _react.useState)(value);
    const current = (0, _react.useRef)(value);
    (0, _react.useLayoutEffect)(() => {
      const from = current.current;
      if (from === value) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        current.current = value;
        setDisplay(value);
        return;
      }
      const start = performance.now();
      let frame;
      function tick(now) {
        const t = Math.min(1, (now - start) / 220);
        current.current = Math.round(value + (from - value) * (1 - t) ** 3);
        setDisplay(current.current);
        if (t < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [value]);
    return /*#__PURE__*/_react.default.createElement("span", {
      className: "number",
      "data-value": value
    }, display < 0 ? '−' : signed && display > 0 ? '+' : '', formatNumber.format(Math.abs(display)), currency && ' ₽');
  }
  function Settings({
    rate,
    change,
    dates,
    setDates,
    openCalendar
  }) {
    const t = Math.min(1, Math.max(0, (rate - 10) / 5));
    function blend(a, b) {
      return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
    }
    return /*#__PURE__*/_react.default.createElement("section", {
      className: "card settings"
    }, /*#__PURE__*/_react.default.createElement("h2", {
      id: "rate-title"
    }, "\u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0437\u0430 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F"), /*#__PURE__*/_react.default.createElement("div", {
      className: "slider",
      style: {
        '--pos': rate * 5 + '%',
        '--fraction': rate / 20,
        '--rim': blend([0, 149, 255], [245, 99, 26]),
        '--edge': blend([116, 214, 253], [241, 175, 18])
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "rail"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "travel"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "thumb"
    }, rate, "%")), /*#__PURE__*/_react.default.createElement("input", {
      type: "range",
      min: "0",
      max: "20",
      step: "1",
      value: rate,
      "aria-labelledby": "rate-title",
      "aria-valuetext": rate + '%',
      onChange: e => change(+e.target.value)
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "limits"
    }, /*#__PURE__*/_react.default.createElement("span", null, "0%"), /*#__PURE__*/_react.default.createElement("span", null, "20%"))), /*#__PURE__*/_react.default.createElement("div", {
      className: "chips"
    }, /*#__PURE__*/_react.default.createElement("button", {
      "aria-pressed": !dates,
      onClick: () => setDates(null)
    }, "\u0412\u0441\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435"), /*#__PURE__*/_react.default.createElement("button", {
      "aria-pressed": !!dates,
      onClick: openCalendar
    }, /*#__PURE__*/_react.default.createElement(Icon, {
      file: "0f30a.svg"
    }), dates ? periodText(dates) : 'Указать период')));
  }
  function Suitcases({
    extra
  }) {
    const asset = useAsset();
    const stage = extra === 0 ? 0 : extra < 5 ? 1 : extra < 9 ? 2 : 3;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: 'result stage-' + stage
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "result-back"
    }, /*#__PURE__*/_react.default.createElement("strong", null, /*#__PURE__*/_react.default.createElement(AnimatedNumber, {
      value: extra,
      signed: true
    })), /*#__PURE__*/_react.default.createElement("b", null, "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445", /*#__PURE__*/_react.default.createElement("br", null), "\u0431\u0440\u043E\u043D\u0435\u0439")), /*#__PURE__*/_react.default.createElement("div", {
      className: "art",
      "aria-hidden": "true"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "bag gray"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: asset('suitcase-gray.png'),
      alt: ""
    })), ['blue', 'orange', 'yellow'].map((name, i) => /*#__PURE__*/_react.default.createElement("div", {
      key: name,
      className: 'bag ' + name + ' ' + (stage > i ? 'present' : '')
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "sprite"
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "",
      src: asset('suitcases.png')
    }))))));
  }
  const metrics = [['Показы в поиске', 300, 100], ['Просмотры объявления', 20, 69.3], ['Бронирования', 1, 49.8]];
  function Forecast({
    forecast,
    title
  }) {
    return /*#__PURE__*/_react.default.createElement("section", {
      className: "card forecast"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "forecast-title"
    }, title), /*#__PURE__*/_react.default.createElement(Suitcases, {
      extra: forecast.extra
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "funnel"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "legend"
    }, "\u0411\u0435\u0437 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F ", /*#__PURE__*/_react.default.createElement("span", null, "\u2192"), " ", /*#__PURE__*/_react.default.createElement("b", null, "\u0421 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435\u043C")), metrics.map(([label, unit, max]) => /*#__PURE__*/_react.default.createElement("div", {
      className: "metric",
      key: label
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", null, label), /*#__PURE__*/_react.default.createElement("span", {
      className: "compare"
    }, formatNumber.format(forecast.organic * unit), " ", /*#__PURE__*/_react.default.createElement("span", null, "\u2192"), " ", /*#__PURE__*/_react.default.createElement("b", null, formatNumber.format(forecast.bookings * unit)))), /*#__PURE__*/_react.default.createElement("div", {
      className: "bars"
    }, /*#__PURE__*/_react.default.createElement("i", {
      style: {
        width: max + '%'
      }
    }), /*#__PURE__*/_react.default.createElement("i", {
      style: {
        width: max * forecast.extra / 15 + '%'
      }
    }))))), /*#__PURE__*/_react.default.createElement("p", {
      className: "footnote"
    }, "\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0439 \u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u043B\u0438\u0447\u0430\u0442\u044C\u0441\u044F \u043E\u0442 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0430."));
  }
  function Finance({
    forecast,
    rate,
    day,
    setDay,
    title,
    connect,
    confirmed
  }) {
    const gross = (day ? 1 : forecast.nights) * 7800;
    const fee = Math.round(gross * 0.15);
    const promo = Math.round(gross * rate / 100);
    const baseline = (day ? 1 : forecast.organic * 2) * 6630;
    const payout = gross - fee - promo;
    const rows = [[day ? 'Стоимость суток' : 'Стоимость проживания', gross], ['Комиссия Циана · 15%', -fee], ['За продвижение · ' + rate + '%', -promo], ['Общая комиссия · ' + (15 + rate) + '%', -(fee + promo)]];
    return /*#__PURE__*/_react.default.createElement("section", {
      className: "card finance"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "finance-body"
    }, /*#__PURE__*/_react.default.createElement("h2", null, "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C"), /*#__PURE__*/_react.default.createElement("div", {
      className: "switch",
      role: "group",
      "aria-label": "\u041F\u0435\u0440\u0438\u043E\u0434 \u0440\u0430\u0441\u0447\u0451\u0442\u0430"
    }, ['За месяц', 'За сутки'].map((s, i) => /*#__PURE__*/_react.default.createElement("button", {
      key: s,
      "aria-pressed": day === !!i,
      onClick: () => setDay(!!i)
    }, s))), /*#__PURE__*/_react.default.createElement("div", {
      className: "period-info"
    }, day ? 'Расчёт за одни сутки проживания' : title, /*#__PURE__*/_react.default.createElement("br", null), day ? 'Стоимость суток · 7 800 ₽' : quantity(forecast.bookings, ['бронирование', 'бронирования', 'бронирований']) + ' · ' + quantity(forecast.nights, ['ночь', 'ночи', 'ночей'])), /*#__PURE__*/_react.default.createElement("div", {
      className: "fees"
    }, rows.map(([label, value]) => /*#__PURE__*/_react.default.createElement("div", {
      className: "row",
      key: label.split(' ·')[0].replace('суток', 'проживания')
    }, /*#__PURE__*/_react.default.createElement("span", null, label), /*#__PURE__*/_react.default.createElement(AnimatedNumber, {
      value: value,
      currency: true
    })))), /*#__PURE__*/_react.default.createElement("div", {
      className: "payouts"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("span", null, "\u0411\u0435\u0437 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F"), /*#__PURE__*/_react.default.createElement(AnimatedNumber, {
      value: baseline,
      currency: true
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "row major"
    }, /*#__PURE__*/_react.default.createElement("b", null, "\u0421 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435\u043C"), /*#__PURE__*/_react.default.createElement(AnimatedNumber, {
      value: payout,
      currency: true
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "delta",
      "aria-label": day ? 'Разница за сутки' : 'Возможный прирост выплаты'
    }, /*#__PURE__*/_react.default.createElement(AnimatedNumber, {
      value: payout - baseline,
      signed: true,
      currency: true
    })))), /*#__PURE__*/_react.default.createElement("div", {
      className: "action"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "primary",
      disabled: !rate,
      onClick: connect
    }, rate ? 'Подключить продвижение' : 'Продвижение выключено'), /*#__PURE__*/_react.default.createElement("p", {
      className: "footnote",
      role: "status"
    }, confirmed ? 'Продвижение подключено в прототипе.' : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "\u041F\u0440\u0438 \u0441\u0440\u0435\u0434\u043D\u0435\u0439 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F 2 \u043D\u043E\u0447\u0438.", /*#__PURE__*/_react.default.createElement("br", null), "\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u0438, \u0431\u0435\u0437 \u0443\u0447\u0451\u0442\u0430 \u0432\u0430\u0448\u0438\u0445 \u0440\u0430\u0441\u0445\u043E\u0434\u043E\u0432."))));
  }
  function PromotionModal({
    open = true,
    embedded = false,
    onClose,
    onConnect,
    assetBase = "assets/"
  }) {
    const [rate, setRate] = (0, _react.useState)(5),
      [dates, setDates] = (0, _react.useState)(null);
    const [calendar, setCalendar] = (0, _react.useState)(false),
      [day, setDay] = (0, _react.useState)(false),
      [confirmed, setConfirmed] = (0, _react.useState)(false);
    const forecast = model(rate, dates);
    const title = dates ? 'Прогноз на ' + quantity(forecast.days, ['день', 'дня', 'дней']) + ' выбранного периода' : 'Прогноз на ближайшие 30 дней';
    function saveDates(next) {
      setDates(next);
      setCalendar(false);
      setConfirmed(false);
    }
    (0, _react.useEffect)(() => {
      if (!open) setCalendar(false);
    }, [open]);
    function connect() {
      setConfirmed(true);
      onConnect?.({
        rate,
        dates: dates ? [...dates] : null
      });
    }
    if (!open) return null;
    const content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "columns"
    }, /*#__PURE__*/_react.default.createElement("main", {
      className: "left"
    }, /*#__PURE__*/_react.default.createElement(Listing, null), /*#__PURE__*/_react.default.createElement(Settings, {
      rate: rate,
      change: v => {
        setRate(v);
        setConfirmed(false);
      },
      dates: dates,
      setDates: saveDates,
      openCalendar: () => setCalendar(true)
    }), /*#__PURE__*/_react.default.createElement(Forecast, {
      forecast: forecast,
      title: title
    })), /*#__PURE__*/_react.default.createElement(Finance, {
      forecast: forecast,
      title: title,
      rate: rate,
      day: day,
      setDay: setDay,
      confirmed: confirmed,
      connect: connect
    })), calendar && /*#__PURE__*/_react.default.createElement(Calendar, {
      dates: dates,
      save: saveDates,
      cancel: () => setCalendar(false)
    }));
    return /*#__PURE__*/_react.default.createElement(AssetBase.Provider, {
      value: assetBase
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "performance-vas"
    }, embedded ? /*#__PURE__*/_react.default.createElement("div", {
      className: "embedded-promotion"
    }, content) : /*#__PURE__*/_react.default.createElement(Modal, {
      label: "\u041F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F",
      onClose: onClose
    }, content)));
  }
});
