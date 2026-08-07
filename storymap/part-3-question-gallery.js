/* ============================================================================
   第三部分「適合的研究問題」— 四線關係圖表 互動圖庫的行為

   只負責介紹網站內的示範圖表，不讀寫任何審閱狀態。所有日期、標題與引文均來自
   part-3-question-gallery-data.js（由 build_part3_question_data.py 產生）。

   兩張圖共用同一組節點與三條回應鏈，第二張再加入「文書傳遞時間差」的示範：
     鏈一（藍｜官員上奏線）：官員上奏 → 戰場事件　（回應特定事件）
     鏈二（紫｜皇帝行動線）：皇帝行動 → 上諭／硃批　（回應官員的奏報與行動）
     鏈三（藍虛線｜官員上奏線）：後續官員文書 → 上諭　（執行皇帝的命令）
   ========================================================================== */

(() => {
  'use strict';

  const data = window.PART3_QUESTION_DATA;
  const root = document.querySelector('[data-part3-qgallery]');
  if (!data || !root) return;

  const laneColor = Object.fromEntries(data.lanes.map((lane) => [lane.key, lane.color]));
  const laneIndexOf = Object.fromEntries(data.lanes.map((lane, index) => [lane.key, index]));

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));

  const parseDate = (value) => {
    if (!value) return null;
    const parts = String(value).split('/').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  /* --------------------------------------------------------- 節點資料組裝 */

  const zhu42 = data.documents['硃42'];
  const yu24 = data.documents['諭24'];
  const zhu113 = data.documents['硃113'];

  const baseDots = () => ([
    ...data.eventDots.map((event, index) => ({
      key: `e${index}`, lane: 'events', date: parseDate(event.dateAr),
      whenCh: event.whenCh, title: event.subtitle, description: event.description,
      quote: event.quote, quoteDocId: event.quoteDocId, kind: 'event', actor: event.actor
    })),
    {
      key: 'doc-zhu42', lane: 'official', date: parseDate(zhu42.sendDate[1]),
      whenCh: zhu42.sendDate[0], title: `${zhu42.docId}　${zhu42.title}`,
      description: `${zhu42.author.position}${zhu42.author.name}上奏`, kind: 'doc'
    },
    {
      key: 'doc-zhu42-pi', lane: 'imperial', date: parseDate(zhu42.receiveDate[1]),
      whenCh: zhu42.receiveDate[0], title: `${zhu42.docId}　硃批`, kind: 'doc',
      description: zhu42.rescriptText ? `硃批：${zhu42.rescriptText}` : ''
    },
    {
      key: 'doc-yu24', lane: 'imperial', date: parseDate(yu24.announceDate[1]),
      whenCh: yu24.announceDate[0], title: `${yu24.docId}　${yu24.title}`, kind: 'doc',
      description: '上諭'
    },
    ...data.emperorDots.map((action, index) => ({
      key: `a${index}`, lane: 'emperor', date: parseDate(yu24.announceDate[1]),
      whenCh: yu24.announceDate[0], title: action.subtitle, description: action.description,
      quote: action.quote, quoteDocId: action.quoteDocId, kind: 'action',
      // 三個皇帝行動同日發布，用小偏移避免重疊。
      dayOffset: index * 0.6
    })),
    {
      key: 'doc-zhu113', lane: 'official', date: parseDate(zhu113.sendDate[1]),
      whenCh: zhu113.sendDate[0], title: `${zhu113.docId}　${zhu113.title}`, kind: 'doc',
      description: `${zhu113.author.position}${zhu113.author.name}上奏`
    }
  ]);

  const transitDots = () => data.transitDots.map((event, index) => ({
    key: `t${index}`, lane: 'events', date: parseDate(event.dateAr),
    whenCh: event.whenCh, title: event.subtitle, description: event.description,
    quote: event.quote, quoteDocId: event.quoteDocId, kind: 'transit', actor: event.actor
  }));

  /* 三條回應鏈：tail＝回應者（箭頭起點），head＝被回應的對象（箭頭終點），
     呼應「地方官員如何回應特定事件」等句式：X 回應 Y，箭頭由 X 指向 Y。 */
  const groups = [
    {
      id: 'g-events', color: laneColor.official, dashed: false,
      tails: ['doc-zhu42'], heads: ['e0', 'e1', 'e2', 'e3'],
      text: '地方官員如何回應特定事件', textNear: 'doc-zhu42', textSide: 'left'
    },
    {
      id: 'g-emperor', color: laneColor.emperor, dashed: false,
      tails: ['a0', 'a1', 'a2'], heads: ['doc-yu24'],
      text: '皇帝如何回應地方官員的奏報與行動', textNear: 'doc-yu24', textSide: 'right'
    },
    {
      id: 'g-execute', color: laneColor.official, dashed: true,
      tails: ['doc-zhu113'], heads: ['doc-yu24'],
      text: '地方官員如何執行皇帝的命令', textNear: 'doc-zhu113', textSide: 'right'
    }
  ];

  /* 文書自身的送出／收批進程，畫成細灰虛線，不是回應箭頭。 */
  const documentFlow = [
    ['doc-zhu42', 'doc-zhu42-pi']
  ];

  const SLIDES = [
    {
      id: 'chains', label: '三種回應鏈',
      caption: '同一組文書和事件，示範研究者可以沿四條線追問的三種問題。',
      extraDots: [], showGap: false
    },
    {
      id: 'gap', label: '文書傳遞的時間差',
      caption: `硃42 於${zhu42.sendDate[0]}發出，直到${yu24.announceDate[0]}皇帝才發布回應——中間相隔 ${data.transitGapDays} 天。地理距離造成的傳遞延遲，讓戰場事件線上持續累積皇帝尚未得知的新事件。`,
      extraDots: transitDots(), showGap: true
    }
  ];

  /* ------------------------------------------------------------ 版面組裝 */

  root.innerHTML = `
    <div class="part3-qgallery-head">
      <h4>示範：四線圖表如何回答不同的研究問題</h4>
      <span>示範文書：硃42　諭24　硃113</span>
    </div>
    <div class="part3-qgallery-stage" data-qstage>
      ${SLIDES.map((slide, index) => `
        <section class="part3-qslide${index === 0 ? ' is-active' : ''}" data-qslide="${slide.id}">
          <div class="part3-qchart">
            <div class="part3-qlane-heads">
              ${data.lanes.map((lane) => `<span style="color:${lane.color}">${escapeHtml(lane.label)}</span>`).join('')}
            </div>
            <div class="part3-qplot" data-qplot>
              <div class="part3-qlane-lines" aria-hidden="true">
                ${data.lanes.map((lane) => `<span style="color:${lane.color}"></span>`).join('')}
              </div>
              <svg class="part3-qarrows" data-qarrows aria-hidden="true" focusable="false"></svg>
            </div>
          </div>
          <div class="part3-qlegend" data-qlegend>
            ${groups.map((group) => `
              <div class="part3-qlegend-item" data-qlegend-item="${group.id}" tabindex="0" role="button"
                   style="--swatch-color:${group.color}">
                <span class="part3-qlegend-swatch"></span>
                <p>${escapeHtml(group.text)}</p>
              </div>
            `).join('')}
            ${slide.showGap ? `
              <div class="part3-qlegend-item" data-qlegend-item="g-gap" tabindex="0" role="button" style="--swatch-color:#c99a3f">
                <span class="part3-qlegend-swatch"></span>
                <p>${escapeHtml(slide.caption)}</p>
              </div>
            ` : `<p style="margin:6px 8px 0; max-width:640px; color:var(--text); font:var(--body-weight) calc(12px * var(--font-scale))/1.6 var(--serif);">${escapeHtml(slide.caption)}</p>`}
          </div>
        </section>
      `).join('')}
    </div>
    <div class="part3-qnav">
      <button class="part3-qnav-btn" type="button" data-qprev>← 上一張</button>
      <div class="part3-qnav-dots" data-qdots>
        ${SLIDES.map((slide, index) => `<button class="part3-qnav-dot${index === 0 ? ' is-active' : ''}" type="button" data-qgoto="${index}" aria-label="第 ${index + 1} 張：${escapeHtml(slide.label)}"></button>`).join('')}
      </div>
      <button class="part3-qnav-btn" type="button" data-qnext>下一張 →</button>
    </div>
  `;

  /* --------------------------------------------------------- 節點座標計算 */

  const renderSlide = (slideEl, slide) => {
    const plot = slideEl.querySelector('[data-qplot]');
    const svg = slideEl.querySelector('[data-qarrows]');
    const dots = [...baseDots(), ...slide.extraDots];

    const times = dots.map((dot) => dot.date?.getTime()).filter((value) => value != null);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const span = Math.max(1, maxTime - minTime);
    const marginTop = 9, marginBottom = 9;

    const yFor = (dot) => {
      const t = (dot.date?.getTime() ?? minTime) + (dot.dayOffset || 0) * 86400000;
      const ratio = (t - minTime) / span;
      return marginTop + ratio * (100 - marginTop - marginBottom);
    };
    const xFor = (dot) => ((laneIndexOf[dot.lane] + 0.5) / data.lanes.length) * 100;

    const byKey = new Map();
    dots.forEach((dot) => { dot.x = xFor(dot); dot.y = yFor(dot); byKey.set(dot.key, dot); });

    /* 同一時間點在同一線上會重疊（例如三個皇帝行動同一天），
       依 key 順序小幅水平錯開，避免圓點疊在一起。 */
    const laneBuckets = new Map();
    dots.forEach((dot) => {
      const bucketKey = `${dot.lane}:${Math.round(dot.y)}`;
      laneBuckets.set(bucketKey, [...(laneBuckets.get(bucketKey) || []), dot]);
    });
    laneBuckets.forEach((bucket) => {
      if (bucket.length < 2) return;
      const spread = 8.5;
      bucket.forEach((dot, index) => {
        dot.x += (index - (bucket.length - 1) / 2) * spread;
      });
    });

    plot.querySelectorAll('.part3-qdot, .part3-qdot-date, .part3-qtext, .part3-qgap').forEach((el) => el.remove());
    svg.innerHTML = '';

    dots.forEach((dot) => {
      const color = laneColor[dot.lane];
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `part3-qdot${dot.kind === 'transit' ? ' part3-qdot-transit' : ''}`;
      el.style.left = `${dot.x}%`;
      el.style.top = `${dot.y}%`;
      el.style.background = dot.kind === 'transit' ? '#c99a3f' : color;
      el.dataset.qdot = dot.key;
      el.setAttribute('aria-label', dot.title);
      el.title = dot.title;
      plot.appendChild(el);

      const dateLabel = document.createElement('span');
      dateLabel.className = 'part3-qdot-date';
      dateLabel.style.left = `${dot.x}%`;
      dateLabel.style.top = `calc(${dot.y}% + 9px)`;
      dateLabel.textContent = dot.whenCh ? dot.whenCh.replace(/^乾隆[^年]*年/, '') : '';
      plot.appendChild(dateLabel);

      el.addEventListener('click', () => showTooltip(el, dot));
    });

    /* 箭頭一律以實際像素座標繪製（而非抽象的 0–100 座標系），
       做法與 part-1-interface.js 的節點連線一致：量出容器實際尺寸，
       直接用像素畫線與箭頭三角形，避免 viewBox 縮放造成的變形。 */
    const rect = plot.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const px = (dot) => ({ x: (dot.x / 100) * width, y: (dot.y / 100) * height });

    const svgNS = 'http://www.w3.org/2000/svg';
    const makeLine = (p1, p2, { stroke, width: strokeWidth, dashed, className }) => {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', p1.x.toFixed(1)); line.setAttribute('y1', p1.y.toFixed(1));
      line.setAttribute('x2', p2.x.toFixed(1)); line.setAttribute('y2', p2.y.toFixed(1));
      line.setAttribute('stroke', stroke);
      line.setAttribute('stroke-width', String(strokeWidth));
      if (dashed) line.setAttribute('stroke-dasharray', '6 5');
      if (className) line.setAttribute('class', className);
      return line;
    };
    const makeArrowHead = (tip, angle, color) => {
      const size = 7;
      const spread = 0.44; // 弧度，箭頭開角
      const p1 = { x: tip.x - size * Math.cos(angle - spread), y: tip.y - size * Math.sin(angle - spread) };
      const p2 = { x: tip.x - size * Math.cos(angle + spread), y: tip.y - size * Math.sin(angle + spread) };
      const poly = document.createElementNS(svgNS, 'polygon');
      poly.setAttribute('points', `${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`);
      poly.setAttribute('fill', color);
      return poly;
    };

    /* 文書自身的送出→收批進程：細灰虛線，非回應箭頭。 */
    documentFlow.forEach(([fromKey, toKey]) => {
      const from = byKey.get(fromKey); const to = byKey.get(toKey);
      if (!from || !to) return;
      svg.appendChild(makeLine(px(from), px(to), { stroke: '#c3b49a', width: 1, dashed: true, className: 'part3-qflow-line' }));
    });

    /* 三條回應鏈的箭頭：起點在每個 tail 節點中心，終點在 head 節點邊緣。 */
    groups.forEach((group) => {
      const heads = group.heads.map((key) => byKey.get(key)).filter(Boolean);
      const tails = group.tails.map((key) => byKey.get(key)).filter(Boolean);
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'part3-qgroup');
      g.setAttribute('data-qgroup', group.id);
      tails.forEach((tail) => heads.forEach((head) => {
        const p1 = px(tail); const p2raw = px(head);
        const dx = p2raw.x - p1.x, dy = p2raw.y - p1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx);
        const shrink = 9; // 留出箭頭長度，終點不壓在圓點上
        const p2 = { x: p2raw.x - (dx / dist) * shrink, y: p2raw.y - (dy / dist) * shrink };
        g.appendChild(makeLine(p1, p2, { stroke: group.color, width: 2, dashed: group.dashed, className: 'part3-qarrow-path' }));
        g.appendChild(makeArrowHead(p2, angle, group.color));
      }));
      svg.appendChild(g);
    });

    /* 浮動 Text 標籤：貼在該鏈的 tail 節點旁。 */
    groups.forEach((group) => {
      const anchor = byKey.get(group.textNear);
      if (!anchor) return;
      const label = document.createElement('button');
      label.type = 'button';
      label.className = 'part3-qtext';
      label.dataset.qtextFor = group.id;
      label.style.setProperty('--callout-color', group.color);
      label.style.top = `calc(${anchor.y}% - 34px)`;
      label.style[group.textSide === 'left' ? 'right' : 'left'] =
        group.textSide === 'left'
          ? `calc(${100 - anchor.x}% + 12px)`
          : `calc(${anchor.x}% + 12px)`;
      label.textContent = group.text;
      plot.appendChild(label);
      label.addEventListener('click', () => setHot(slideEl, group.id));
      label.addEventListener('pointerenter', () => setHot(slideEl, group.id));
      label.addEventListener('pointerleave', () => setHot(slideEl, null));
    });

    /* 第二張圖：官員上奏（硃42 送出）與皇帝行動（諭24 發布）之間的天數標註。 */
    if (slide.showGap) {
      const from = byKey.get('doc-zhu42');
      const to = byKey.get('doc-yu24');
      if (from && to) {
        const gap = document.createElement('div');
        gap.className = 'part3-qgap';
        gap.style.left = `${(from.x + to.x) / 2}%`;
        gap.style.top = `calc(${(from.y + to.y) / 2}% - 14px)`;
        gap.style.transform = 'translate(-50%, -50%)';
        gap.innerHTML = `相隔 ${data.transitGapDays} 天<span>地理距離與文書傳遞造成的時間差</span>`;
        plot.appendChild(gap);
      }
    }
  };

  /* -------------------------------------------------------------- 提示框 */

  let tooltipEl = null;
  const showTooltip = (dotEl, dot) => {
    tooltipEl?.remove();
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'part3-qtext';
    tooltipEl.style.setProperty('--callout-color', '#3c5754');
    tooltipEl.style.left = dotEl.style.left;
    tooltipEl.style.top = `calc(${parseFloat(dotEl.style.top)}% + 12px)`;
    tooltipEl.style.maxWidth = '240px';
    const quoteLine = dot.quote ? `<br><br>「${escapeHtml(dot.quote)}」<br>—${escapeHtml(dot.quoteDocId || '')}` : '';
    tooltipEl.innerHTML = `<strong>${escapeHtml(dot.title)}</strong>${dot.description ? `<br>${escapeHtml(dot.description)}` : ''}${quoteLine}`;
    dotEl.closest('[data-qplot]').appendChild(tooltipEl);
    const close = (event) => {
      if (tooltipEl && !tooltipEl.contains(event.target) && event.target !== dotEl) {
        tooltipEl.remove(); tooltipEl = null;
        document.removeEventListener('click', close, true);
      }
    };
    window.setTimeout(() => document.addEventListener('click', close, true), 0);
  };

  const setHot = (slideEl, groupId) => {
    const groupEls = slideEl.querySelectorAll('[data-qgroup]');
    const legendEls = slideEl.querySelectorAll('[data-qlegend-item]');
    const textEls = slideEl.querySelectorAll('[data-qtext-for]');
    if (!groupId) {
      groupEls.forEach((el) => el.classList.remove('is-hot', 'is-dim'));
      legendEls.forEach((el) => el.classList.remove('is-hot'));
      textEls.forEach((el) => el.classList.remove('is-hot'));
      return;
    }
    groupEls.forEach((el) => el.classList.toggle('is-hot', el.getAttribute('data-qgroup') === groupId));
    groupEls.forEach((el) => el.classList.toggle('is-dim', el.getAttribute('data-qgroup') !== groupId));
    legendEls.forEach((el) => el.classList.toggle('is-hot', el.dataset.qlegendItem === groupId));
    textEls.forEach((el) => el.classList.toggle('is-hot', el.dataset.qtextFor === groupId));
  };

  /* -------------------------------------------------------------- 導覽列 */

  const slideEls = [...root.querySelectorAll('[data-qslide]')];
  const dotBtns = [...root.querySelectorAll('[data-qgoto]')];
  let current = 0;
  let rendered = new Set();

  const goTo = (index) => {
    current = (index + SLIDES.length) % SLIDES.length;
    slideEls.forEach((el, i) => el.classList.toggle('is-active', i === current));
    dotBtns.forEach((btn, i) => btn.classList.toggle('is-active', i === current));
    if (!rendered.has(current)) {
      renderSlide(slideEls[current], SLIDES[current]);
      rendered.add(current);
    }
  };

  root.querySelector('[data-qprev]')?.addEventListener('click', () => goTo(current - 1));
  root.querySelector('[data-qnext]')?.addEventListener('click', () => goTo(current + 1));
  dotBtns.forEach((btn) => btn.addEventListener('click', () => goTo(Number(btn.dataset.qgoto))));

  slideEls.forEach((slideEl) => {
    slideEl.querySelectorAll('[data-qlegend-item]').forEach((item) => {
      const groupId = item.dataset.qlegendItem;
      if (groupId === 'g-gap') return;
      item.addEventListener('click', () => setHot(slideEl, groupId));
      item.addEventListener('pointerenter', () => setHot(slideEl, groupId));
      item.addEventListener('pointerleave', () => setHot(slideEl, null));
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setHot(slideEl, groupId); }
      });
    });
  });

  goTo(0);

  /* 換頁或視窗尺寸改變時，重新排版目前顯示的那張圖（座標為百分比，
     不需要在 resize 時重算，只有初次渲染需要建立 DOM）。 */
  window.addEventListener('resize', () => {
    if (slideEls[current]) renderSlide(slideEls[current], SLIDES[current]);
  });
})();
