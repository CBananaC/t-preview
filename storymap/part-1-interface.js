/* ============================================================================
   第一部分「平台的整體介面」— 審閱工具互動複本的行為

   這個檔案只負責介紹網站內的教學複本。它不會讀取或寫入任何審閱狀態，
   也不會載入 review-tools 內的檔案；所有內容都來自 part-1-interface-data.js。

   四個可點區域：
     1 導覽列          兩個浮動標籤：輸入與輸出資料、切換介面區域
     2 時間與關係圖表  四條線各有一個固定圓點，點擊開啟節點資訊區
     3 原始史料區      示範 AI Skills 篩選標示
     4 AI 分析區       四個步驟：本機執行 → 候選卡片 → 加入圖表 → 引文定位
   ========================================================================== */

(() => {
  'use strict';

  const data = window.PART1_INTERFACE_DATA;
  const root = document.querySelector('[data-part1]');
  if (!data || !root) return;

  const replica = root.querySelector('[data-part1-replica]');
  const progressText = root.querySelector('[data-part1-progress]');

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));

  /* ---------------------------------------------------------------- 原文 */

  /* 在原文中把每段引文包成 <mark>，供篩選標示與引文定位使用。
     引文由建置腳本確認過是原文的連續子字串，因此可直接以位置切分。 */
  const buildDocumentBody = () => {
    const body = data.document.body;
    const spans = [];
    const seen = new Set();
    const collect = (item) => {
      if (!item || !item.quote || item.quoteDocId !== data.document.docId) return;
      if (seen.has(item.quote)) return;
      const start = body.indexOf(item.quote);
      if (start < 0) return;
      seen.add(item.quote);
      spans.push({ start, end: start + item.quote.length, skill: item.aiFilterLabel, key: item.id });
    };
    collect(data.dots.events);
    data.aiCandidates.forEach(collect);

    spans.sort((a, b) => a.start - b.start);
    let html = '';
    let cursor = 0;
    spans.forEach((span) => {
      if (span.start < cursor) return;
      html += escapeHtml(body.slice(cursor, span.start));
      html += `<mark data-skill="${escapeHtml(span.skill)}" data-quote-key="${escapeHtml(span.key)}">`
        + `${escapeHtml(body.slice(span.start, span.end))}</mark>`;
      cursor = span.end;
    });
    html += escapeHtml(body.slice(cursor));
    return html.replace(/\n/g, '<br>');
  };

  /* ------------------------------------------------------------ 版面組裝 */

  const doc = data.document;
  const authorLine = doc.author.name;
  const sourceLine = `明清台檔${doc.compiledIn.book}, ${doc.compiledIn.page}, ${doc.docId}`;
  const compactDate = (value) => String(value || '').replace(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, (_, year, month, day) => `${year}/${Number(month)}/${Number(day)}`);
  const dateLine = `${compactDate(doc.sendDate[1])}-${compactDate(doc.receiveDate[1]).replace(/^\d{4}\//, '')}（15 日）`;

  /* 四條線的固定圓點。圓點的水平位置由 dateAr 計算，
     保持與真正樣本工具的橫向時間軸閱讀方式一致。 */
  const laneDots = [
    { lane: 'events', actor: 'lin', dot: data.dots.events, label: data.dots.events.whenCh },
    { lane: 'official', actor: 'official', dot: data.dots.official, label: '十二月十八日' },
    { lane: 'imperial', actor: 'imperial', dot: data.dots.imperial, label: '正月初二日' },
    { lane: 'emperor', actor: 'emperor', dot: data.dots.emperor, label: '正月初二日' }
  ];

  const laneIndex = Object.fromEntries(data.lanes.map((lane, index) => [lane.key, index]));

  replica.innerHTML = `
    <div class="part1-region part1-toolbar" data-region="nav">
      <button class="part1-hotspot" type="button" data-hotspot="nav">
        <span class="part1-hotspot-num">1</span>導覽列
      </button>
      <div class="part1-toolbar-start">
        <div class="part1-menu">
          <button class="part1-pill part1-pill-button" type="button" data-type-toggle><span class="part1-pl">點線類型</span><span aria-hidden="true">⌄</span></button>
          <div class="part1-menu-pop part1-type-pop" data-type-pop hidden>
            <strong>點線類型</strong>
            <label><input type="checkbox" checked> 戰場事件</label>
            <label><input type="checkbox" checked> 官員上奏</label>
            <label><input type="checkbox" checked> 皇帝硃批下旨</label>
            <label><input type="checkbox" checked> 皇帝行動</label>
          </div>
        </div>
        <div class="part1-people-control"><span class="part1-pl">人物</span><select aria-label="選擇人物"><option>— 選擇人物 —</option></select><button type="button" aria-label="新增人物">＋</button></div>
        <label class="part1-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="搜尋原文 / 所有欄位…" aria-label="搜尋原文或所有欄位"></label>
      </div>
      <span class="part1-toolbar-spacer"></span>
      <span class="part1-toolgroup" data-toolgroup="io">
        <button class="part1-toolbtn part1-gear-btn" type="button" data-tool-toggle="tools" aria-label="工具">⚙</button>
        <div class="part1-menu-pop part1-tools-pop" data-tools-pop hidden>
          <strong>工具</strong>
          <div class="part1-tools-row"><button type="button">匯出</button><button type="button">分項匯出</button></div>
          <div class="part1-tools-row"><button type="button" class="is-pointed">輸入資料</button><button type="button">載入技能輸出</button></div>
          <div class="part1-tools-divider"></div>
          <span>字級　介面 A− A＋　正文 A− A＋</span>
        </div>
      </span>
      <span class="part1-toolgroup" data-toolgroup="areas">
        <button class="part1-toolbtn" type="button" data-region-trigger="doc">Note</button>
        <button class="part1-toolbtn is-emphasis" type="button" data-region-trigger="ai">AI</button>
        <button class="part1-toolbtn" type="button" data-region-trigger="chart">事件鏈</button>
      </span>
      <span class="part1-count">236/363</span>
      <div class="part1-callout" data-callout="nav-io" hidden>
        <h5>輸入與輸出資料</h5>
        <p>從本機輸入結構化的原始文本和 AI 分析結果，完成檢視後亦可輸出，供後續研究使用。</p>
      </div>
      <div class="part1-callout" data-callout="nav-areas" hidden>
        <h5>切換介面區域</h5>
        <p>開啟或收合筆記、AI 分析區與事件鏈，沿事件的時間順序追蹤資訊如何傳遞。</p>
      </div>
    </div>

    <div class="part1-stage">
      <div class="part1-region part1-chart" data-region="chart">
        <button class="part1-hotspot" type="button" data-hotspot="chart">
          <span class="part1-hotspot-num">2</span>時間與關係圖表
        </button>
        <div class="part1-chart-axis-note">${escapeHtml(doc.sendDate[1])}　—　${escapeHtml(doc.receiveDate[1])}</div>
        <div class="part1-lane-heads">
          ${data.lanes.map((lane) => `<span>${escapeHtml(lane.label)}</span>`).join('')}
        </div>
        <div class="part1-lanes" data-lanes>
          <svg class="part1-chart-links" data-chart-links aria-hidden="true" focusable="false"></svg>
          ${data.lanes.map((lane) => `<div class="part1-lane" data-lane="${escapeHtml(lane.key)}"><span class="part1-lane-label">${escapeHtml(lane.label)}</span><div class="part1-lane-track"></div></div>`).join('')}
        </div>
        <div class="part1-ruler-labels" aria-hidden="true"><span>11</span><span>21</span><span>12/18</span><span>21</span><span>1/2</span><span>11</span><span>21</span><span>2/1</span></div>
        <div class="part1-nodepanel" data-nodepanel hidden></div>
      </div>

      <aside class="part1-dock">
        <div class="part1-region part1-ai part1-linked-panel part1-tool-box" data-region="ai">
          <button class="part1-hotspot" type="button" data-hotspot="ai">
            <span class="part1-hotspot-num">4</span>AI 分析區
          </button>
          <div class="part1-linked-head tool-box-head"><span>☷</span><span>⌄</span><span>↪</span><span class="part1-window-controls">✣　×</span></div>
          <div class="part1-ai-body tool-box-body" data-ai-body></div>
        </div>

        <div class="part1-region part1-doc part1-ip" data-region="doc">
          <button class="part1-hotspot" type="button" data-hotspot="doc">
            <span class="part1-hotspot-num">3</span>原始史料區
          </button>
          <div class="part1-doc-head ip-head">
            <div class="part1-doc-window-controls" aria-hidden="true"><span>✣</span><span>−</span><span>×</span></div>
            <p class="part1-doc-title"><span class="badge">${escapeHtml(doc.docType.slice(0, 1))}</span>${escapeHtml(doc.title)}</p>
            <p class="part1-doc-meta">${escapeHtml(authorLine)}<br>${escapeHtml(dateLine)}<br>${escapeHtml(sourceLine)}</p>
          </div>
          <div class="part1-filterdock ip-filterdock" data-filterdock>
            <button class="part1-filter-icon" type="button" aria-label="篩選">⌕</button>
            <button class="part1-filterbtn" type="button" data-filter="all">全部標示</button>
            <button class="part1-filter-gear" type="button" aria-label="原文設定">⚙</button>
          </div>
          <div class="part1-doc-scroll ip-scroll" data-doc-scroll>
            <p class="part1-doc-section-label">原文</p>
            <p class="part1-doc-body ip-body" data-doc-body>${buildDocumentBody()}</p>
          </div>
        </div>
      </aside>
    </div>

    <div class="part1-progress">
      <span class="part1-progress-text" data-part1-progress>點擊複本上任何一個編號標籤，或點開右側的說明卡片，開始試用四個介面區域。</span>
      <button class="part1-progress-reset" type="button" data-part1-reset>重設示範</button>
    </div>
  `;

  const lanesEl = replica.querySelector('[data-lanes]');
  const linksSvg = replica.querySelector('[data-chart-links]');
  const nodePanel = replica.querySelector('[data-nodepanel]');
  const docBody = replica.querySelector('[data-doc-body]');
  const docScroll = replica.querySelector('[data-doc-scroll]');
  const filterDock = replica.querySelector('[data-filterdock]');
  const aiBody = replica.querySelector('[data-ai-body]');
  const progress = replica.querySelector('[data-part1-progress]');
  let renderedEventItems = [];

  const setProgress = (message) => { if (progress) progress.textContent = message; };

  /* ------------------------------------------------------------ 圖表圓點 */

  const parseDate = (value) => {
    const match = String(value || '').match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    return match ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : 0;
  };
  const chartStart = parseDate('1786/12/11');
  const chartEnd = parseDate('1787/01/02');
  const datePosition = (dateAr) => {
    const span = chartEnd - chartStart || 1;
    return Math.max(5, Math.min(95, ((parseDate(dateAr) - chartStart) / span) * 100));
  };

  const addDot = ({ lane, actor, dot, label, isNew }) => {
    const laneEl = lanesEl.querySelector(`[data-lane="${lane}"]`);
    const track = laneEl?.querySelector('.part1-lane-track');
    if (!track) return null;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `part1-dot${isNew ? ' is-new' : ''}`;
    button.dataset.actor = actor;
    button.style.top = `${datePosition(dot.dateAr)}%`;
    button.style.left = '50%';
    button.setAttribute('aria-label', `${dot.subtitle || dot.title}（${label}）`);
    button.title = `${dot.subtitle || dot.title}`;
    button._part1 = { dot, lane, label };
    track.appendChild(button);

    const date = document.createElement('span');
    date.className = 'part1-dot-date';
    date.style.top = `${datePosition(dot.dateAr)}%`;
    date.style.left = '50%';
    date.textContent = label;
    track.appendChild(date);

    button.addEventListener('click', () => selectDot(button));
    return button;
  };

  const drawLinks = () => {
    if (!linksSvg) return;
    const width = lanesEl.clientWidth;
    const height = lanesEl.clientHeight;
    if (!width || !height) return;
    linksSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    linksSvg.innerHTML = '';

    /* The sample tool's chart is intentionally dense: the many faint
       candidate lines provide the network context behind the selected
       document. This is presentation texture, not additional historical
       data; the four source-backed dots and their links are added below. */
    const plotLeft = 68;
    const plotWidth = Math.max(80, width - plotLeft - 11);
    for (let i = 0; i < 112; i += 1) {
      const fromLane = i % 4;
      const toLane = (i * 3 + 1) % 4;
      const y1 = 18 + ((i * 47) % Math.max(30, height - 28));
      const y2 = 26 + ((i * 83 + 31) % Math.max(30, height - 34));
      const x1 = plotLeft + ((fromLane + .5) / 4) * plotWidth;
      const x2 = plotLeft + ((toLane + .5) / 4) * plotWidth;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'part1-network-line');
      line.setAttribute('x1', String(Math.round(x1)));
      line.setAttribute('y1', String(Math.round(y1)));
      line.setAttribute('x2', String(Math.round(x2)));
      line.setAttribute('y2', String(Math.round(y2)));
      linksSvg.appendChild(line);
      if (i % 2 === 0) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('class', 'part1-network-dot');
        dot.setAttribute('cx', String(Math.round(x1)));
        dot.setAttribute('cy', String(Math.round(y1)));
        dot.setAttribute('r', '2');
        linksSvg.appendChild(dot);
      }
    }
    const rootRect = lanesEl.getBoundingClientRect();
    const dots = [...lanesEl.querySelectorAll('.part1-dot')];
    const byLane = new Map();
    dots.forEach((el) => {
      const key = el._part1.lane;
      byLane.set(key, [...(byLane.get(key) || []), el]);
    });

    /* 依「戰場事件 → 官員上奏 → 皇帝硃批下旨 → 皇帝行動」的順序連線，
       呈現同一份文書所串起的資訊傳遞。 */
    const order = data.lanes.map((lane) => lane.key);
    for (let i = 0; i < order.length - 1; i += 1) {
      const from = byLane.get(order[i]);
      const to = byLane.get(order[i + 1]);
      if (!from || !to) continue;
      from.forEach((a) => to.forEach((b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'part1-chart-link');
        line.setAttribute('x1', String(Math.round(ra.left + ra.width / 2 - rootRect.left)));
        line.setAttribute('y1', String(Math.round(ra.top + ra.height / 2 - rootRect.top)));
        line.setAttribute('x2', String(Math.round(rb.left + rb.width / 2 - rootRect.left)));
        line.setAttribute('y2', String(Math.round(rb.top + rb.height / 2 - rootRect.top)));
        linksSvg.appendChild(line);
      }));
    }
  };

  /* -------------------------------------------------------- 節點資訊區 */

  const renderNodePanel = (payload, laneKey, label) => {
    const isDocument = Boolean(payload.docId && !payload.subtitle);
    const title = payload.subtitle || payload.title;
    const laneLabel = data.lanes[laneIndex[laneKey]].label;

    const rows = [];
    if (payload.whenCh || label) rows.push(['時間', payload.whenCh || label]);
    if (payload.where) rows.push(['地點', payload.where]);
    if (payload.who && payload.who.length) rows.push(['人物', payload.who.join('、')]);
    if (payload.aiFilterLabel) rows.push(['AI Skill', payload.aiFilterLabel]);
    if (isDocument) rows.push(['文書', `${payload.docId}　${payload.title}`]);
    if (payload.rescriptText) rows.push(['硃批', payload.rescriptText]);

    nodePanel.innerHTML = `
      <div class="part1-nodepanel-head">
        <strong>節點資訊區</strong>
        <span style="color:#9a8d79; font:600 calc(10px * var(--font-scale))/1 var(--sans);">${escapeHtml(laneLabel)}</span>
        <button class="part1-nodepanel-close" type="button" data-node-close aria-label="關閉節點資訊區">×</button>
      </div>
      <p class="part1-nodepanel-desc"><strong>${escapeHtml(title)}</strong></p>
      ${payload.description ? `<p class="part1-nodepanel-desc">${escapeHtml(payload.description)}</p>` : ''}
      <dl>${rows.map(([term, value]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl>
      ${payload.quote ? `<button class="part1-quote" type="button" data-quote="${escapeHtml(payload.quote)}" data-quote-doc="${escapeHtml(payload.quoteDocId)}">「${escapeHtml(payload.quote)}」<span class="part1-quote-src">—${escapeHtml(payload.quoteDocId)}　點擊引文，在原始史料區定位</span></button>` : ''}
    `;
    nodePanel.hidden = false;
    nodePanel.querySelector('[data-node-close]')?.addEventListener('click', () => {
      nodePanel.hidden = true;
      lanesEl.querySelectorAll('.part1-dot').forEach((el) => el.classList.remove('is-selected'));
    });
    nodePanel.querySelector('[data-quote]')?.addEventListener('click', (event) => {
      locateQuote(event.currentTarget.dataset.quote, event.currentTarget.dataset.quoteDoc);
    });
  };

  const selectDot = (button) => {
    lanesEl.querySelectorAll('.part1-dot').forEach((el) => el.classList.toggle('is-selected', el === button));
    const { dot, lane, label } = button._part1;
    renderNodePanel(dot, lane, label);
    setRegion('chart', { silent: true });
    setProgress(`已開啟「${dot.subtitle || dot.title}」的節點資訊區。若卡片內有引文，點擊引文即可回到原始史料區核對。`);
  };

  /* -------------------------------------------------------- 引文定位 */

  const locateQuote = (quote, quoteDocId) => {
    if (quoteDocId && quoteDocId !== doc.docId) {
      setProgress(`此引文出自 ${quoteDocId}，不在目前開啟的 ${doc.docId} 原文之內。在真正的工具中，平台會另外開啟 ${quoteDocId} 的文書面板。`);
      return;
    }
    const marks = [...docBody.querySelectorAll('mark')];
    const target = marks.find((mark) => mark.textContent === quote);
    marks.forEach((mark) => mark.classList.remove('is-located'));
    if (!target) {
      setProgress('這段引文沒有對應的標示範圍。');
      return;
    }
    target.classList.add('is-located');
    const scrollRect = docScroll.getBoundingClientRect();
    const markRect = target.getBoundingClientRect();
    docScroll.scrollTop += markRect.top - scrollRect.top - scrollRect.height / 2 + markRect.height / 2;
    setRegion('doc', { silent: true });
    setProgress('已在原始史料區標示該段引文。每一項 AI 結果都可以這樣回到原文核對。');
  };

  /* ------------------------------------------------------ 原始史料篩選 */

  const skills = [...new Set([
    data.dots.events.aiFilterLabel,
    ...data.aiCandidates.map((item) => item.aiFilterLabel)
  ].filter(Boolean))];

  skills.forEach((skill) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part1-filterbtn';
    button.dataset.filter = skill;
    button.textContent = skill;
    filterDock.appendChild(button);
  });

  const applyFilter = (value) => {
    filterDock.querySelectorAll('.part1-filterbtn').forEach((button) => {
      button.classList.toggle('is-on', button.dataset.filter === value);
    });
    docBody.querySelectorAll('mark').forEach((mark) => {
      mark.classList.toggle('is-shown', value === 'all' || mark.dataset.skill === value);
      mark.classList.remove('is-located');
    });
    setProgress(value === 'all'
      ? '已標示全部 AI Skills 的提取範圍。每個顏色代表一項 Skill。'
      : `已標示「${value}」這項 AI Skill 在原文中的提取範圍。`);
  };

  filterDock.addEventListener('click', (event) => {
    const button = event.target.closest('.part1-filterbtn');
    if (!button) return;
    const isOn = button.classList.contains('is-on');
    if (isOn) {
      filterDock.querySelectorAll('.part1-filterbtn').forEach((item) => item.classList.remove('is-on'));
      docBody.querySelectorAll('mark').forEach((mark) => mark.classList.remove('is-shown'));
      setProgress('已關閉標示。');
      return;
    }
    applyFilter(button.dataset.filter);
    setRegion('doc', { silent: true });
  });

  /* ---------------------------------------------------------- AI 分析區 */

  const TERMINAL_LINES = [
    '$ python3 "tool/scripts py/run_ai_loop.py" \\',
    '    --doc 硃42 --skill lin-events --skill qing-actions',
    '',
    '<span class="part1-term-dim">載入原始文本 …… stage1_original_text.json</span>',
    '<span class="part1-term-dim">執行 AI Skills …… 2 項</span>',
    '<span class="part1-term-ok">✓ 已輸出審閱包：review-bundles/</span>',
    '<span class="part1-term-dim">請在網站按「輸入資料」上載此審閱包。</span>'
  ];

  const renderAiIdle = () => {
    aiBody.innerHTML = `
      <div class="part1-linked-source">據奏來源（上諭前 0 日收到）</div>
      <div class="part1-linked-doc">
        <p class="part1-linked-title">${escapeHtml(doc.title)}<br><span>徐嗣曾</span></p>
        <p class="part1-linked-date">${escapeHtml(doc.receiveDate[1])}</p>
        <blockquote><b>①</b>「${escapeHtml('提臣黃仕簡已於十五日由廈門出口放洋')}」</blockquote>
        <blockquote><b>②</b>「${escapeHtml('任承恩亦配兵登舟，合之郝壯猷所帶，計共兵六千人')}」</blockquote>
      </div>
      <div class="part1-linked-foot"><span>${escapeHtml(doc.docId)}</span><button type="button" data-load-cards>查看 AI 結果</button><button type="button">功能⌄</button><span>⚙</span></div>
    `;
    aiBody.querySelector('[data-load-cards]')?.addEventListener('click', renderCandidates);
  };

  let terminalTimer = 0;
  const runTerminal = () => {
    const pre = aiBody.querySelector('[data-terminal]');
    const button = aiBody.querySelector('[data-run-ai]');
    if (!pre) return;
    if (button) button.disabled = true;
    window.clearTimeout(terminalTimer);
    pre.innerHTML = '';
    setRegion('ai', { silent: true });
    setProgress('AI Skills 正在本機執行。平台本身不會呼叫外部模型，研究者完全掌握資料。');

    let index = 0;
    const step = () => {
      if (index >= TERMINAL_LINES.length) {
        highlightImportButton();
        return;
      }
      pre.innerHTML += `${TERMINAL_LINES[index]}\n`;
      index += 1;
      terminalTimer = window.setTimeout(step, 340);
    };
    step();
  };

  const highlightImportButton = () => {
    const ioGroup = replica.querySelector('[data-toolgroup="io"]');
    ioGroup?.classList.add('is-pointed');
    const callout = replica.querySelector('[data-callout="nav-io"]');
    if (callout) callout.hidden = false;
    setProgress('本機執行完成。研究者接著按導覽列的「輸入資料」，把審閱包上載到平台。');
    aiBody.insertAdjacentHTML('beforeend',
      '<div class="part1-step"><span class="part1-step-num">2</span>按導覽列的「輸入資料」上載審閱包，AI 結果會以卡片形式顯示。</div>'
      + '<button class="part1-act" type="button" data-load-cards>上載審閱包</button>');
    aiBody.querySelector('[data-load-cards]')?.addEventListener('click', renderCandidates);
  };

  const renderCandidates = () => {
    replica.querySelector('[data-callout="nav-io"]').hidden = true;
    renderedEventItems = [
      { ...data.dots.events, __confirmed: true, resultLabel: '林方事件', sourceRole: '林方報告' },
      ...data.aiCandidates.map((item) => ({ ...item, resultLabel: '清方行動', sourceRole: '清方軍事行動' }))
    ];

    const actorLabel = (actor) => actor === 'lin' ? '林方事件' : '清方行動';
    const actorClass = (actor) => actor === 'lin' ? 'is-lin' : 'is-qing';
    const sourceDate = (item) => item.quoteDocId === doc.docId ? doc.sendDate[1] : '';
    const sourceTitle = (item) => item.quoteDocId === doc.docId
      ? `${doc.title}（${doc.docId}）`
      : String(item.quoteDocId || '來源文書');
    const sourceChain = (item, index) => `
      <div class="part1-source-chain" data-source-chain="${index}"${item.__confirmed ? '' : ' hidden'}>
        <div class="part1-source-chain-head">
          <span class="part1-source-chain-label">來源鏈 1</span>
          <span class="part1-source-chain-status">直接奏報</span>
        </div>
        <div class="part1-source-hop">
          <span class="part1-source-node">${escapeHtml(sourceTitle(item))}</span>
          <span class="part1-source-arrow" aria-hidden="true">→</span>
          <span class="part1-source-node">${escapeHtml(actorLabel(item.actor))}</span>
        </div>
        <div class="part1-source-chain-events">
          <span>此來源鏈所報事件</span>
          <button class="part1-source-event" type="button" data-quote="${escapeHtml(item.quote)}" data-quote-doc="${escapeHtml(item.quoteDocId)}">
            ${escapeHtml(item.subtitle)}
          </button>
        </div>
      </div>`;
    const renderEventCard = (item, index) => {
      const confirmed = Boolean(item.__confirmed);
      const sendDate = sourceDate(item);
      return `
        <article class="part1-card part1-event-card ${actorClass(item.actor)}${confirmed ? ' is-confirmed' : ''}" data-candidate="${index}">
          <div class="part1-card-head">
            <span>AI ${escapeHtml(actorLabel(item.actor))}</span>
            <span class="part1-card-skill">${escapeHtml(item.aiFilterLabel)}</span>
          </div>
          <p class="part1-card-title">${escapeHtml(item.subtitle)}</p>
          <p class="part1-card-desc">${escapeHtml(item.description)}</p>
          <dl class="part1-event-facts">
            <dt>地點</dt><dd>${escapeHtml(item.where || '？')}</dd>
            ${item.who?.length ? `<dt>人物</dt><dd>${escapeHtml(item.who.join('、'))}</dd>` : ''}
            <dt>發生日期</dt><dd>${escapeHtml(item.whenCh || '未明')}（${escapeHtml(item.dateAr || '未明')}）</dd>
          </dl>
          <div class="part1-event-source">
            <div class="part1-event-source-head">
              <span>來源引文</span>
              <span class="part1-event-source-role">${escapeHtml(item.sourceRole)}</span>
            </div>
            <button class="part1-quote part1-event-quote" type="button" data-quote="${escapeHtml(item.quote)}" data-quote-doc="${escapeHtml(item.quoteDocId)}">
              「${escapeHtml(item.quote)}」
              <span class="part1-quote-src">—${escapeHtml(item.quoteDocId)}／原文　點按定位</span>
            </button>
            <div class="part1-event-source-meta">${escapeHtml(sourceTitle(item))}${sendDate ? `　發送日 ${escapeHtml(sendDate)}` : ''}</div>
          </div>
          <div class="part1-card-acts">
            ${confirmed
              ? '<span class="part1-confirmed">✓ 已加入</span>'
              : `<button class="part1-act" type="button" data-add="${index}">加入圖表</button>
                 ${sendDate ? `<button class="part1-act part1-act-date" type="button" data-use-date="${index}">用文書發送日 ${escapeHtml(sendDate)}</button>` : ''}
                 <button class="part1-act part1-act-skip" type="button" data-skip="${index}">略過</button>`}
          </div>
          <p class="part1-card-status" data-status="${index}">${confirmed ? '此林方事件已在圖表上；以下保留其來源鏈供核對。' : ''}</p>
          ${sourceChain(item, index)}
        </article>`;
    };

    const groups = ['lin', 'qing'].map((actor) => {
      const items = renderedEventItems.map((item, index) => ({ item, index })).filter(({ item }) => item.actor === actor);
      if (!items.length) return '';
      return `<section class="part1-event-group ${actorClass(actor)}">
        <div class="part1-event-group-head"><span>${actor === 'lin' ? '林方事件' : '清方行動'}</span><span>${items.length} 項</span></div>
        ${items.map(({ item, index }) => renderEventCard(item, index)).join('')}
      </section>`;
    }).join('');

    aiBody.innerHTML = `
      <div class="part1-step"><span class="part1-step-num">3</span>AI 結果依照林方／清方事件分組。每張卡先顯示事件內容，再顯示可回到原文核對的來源引文；只有確認後才加入圖表。</div>
      ${groups}
    `;
    setProgress('AI 結果已載入。先點來源引文回原文核對，再確認是否加入圖表。');

    aiBody.querySelectorAll('[data-quote]').forEach((button) => {
      button.addEventListener('click', () => locateQuote(button.dataset.quote, button.dataset.quoteDoc));
    });
    aiBody.querySelectorAll('[data-add]').forEach((button) => {
      button.addEventListener('click', () => addCandidate(Number(button.dataset.add)));
    });
    aiBody.querySelectorAll('[data-skip]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.skip);
        const card = aiBody.querySelector(`[data-candidate="${index}"]`);
        card?.classList.add('is-skipped');
        card?.querySelectorAll('.part1-act').forEach((item) => { item.disabled = true; });
        const status = aiBody.querySelector(`[data-status="${index}"]`);
        if (status) status.textContent = '已略過：此項不會加入圖表。';
        setProgress('已略過該項結果。被略過的結果不會進入圖表，原始文書不受影響。');
      });
    });
    aiBody.querySelectorAll('[data-use-date]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.useDate);
        const item = renderedEventItems[index];
        const status = aiBody.querySelector(`[data-status="${index}"]`);
        if (status) status.textContent = `已套用來源文書發送日：${sourceDate(item)}。正式工具會以此日期補正事件位置。`;
        button.disabled = true;
        setProgress('已示範以來源文書發送日補正事件日期；正式工具會把修正後日期帶入圖表。');
      });
    });
  };

  const addedCandidates = new Set();
  const addCandidate = (index) => {
    if (addedCandidates.has(index)) return;
    const item = renderedEventItems[index];
    if (!item || item.__confirmed) return;
    addedCandidates.add(index);

    const card = aiBody.querySelector(`[data-candidate="${index}"]`);
    card?.classList.add('is-added');
    card?.querySelectorAll('.part1-act').forEach((button) => { button.disabled = true; });
    const status = aiBody.querySelector(`[data-status="${index}"]`);
    if (status) status.textContent = '已加入圖表：可在「戰場事件」線上點擊新圓點查看；來源鏈已保留在此卡片下方。';
    card?.querySelector('.part1-source-chain')?.removeAttribute('hidden');

    const button = addDot({
      lane: 'events',
      actor: item.actor === 'lin' ? 'lin' : 'qing',
      dot: item,
      label: item.whenCh,
      isNew: true
    });
    drawLinks();
    setRegion('chart', { silent: true });
    setProgress(`「${item.subtitle}」已加入戰場事件線。點擊新圓點，或在卡片下方查看其來源鏈。`);
    window.setTimeout(() => button?.classList.remove('is-new'), 700);
  };

  /* ---------------------------------------------------------- 區域切換 */

  const REGION_LABEL = {
    nav: '導覽列', chart: '時間與關係圖表', doc: '原始史料區', ai: 'AI 分析區'
  };

  const REGION_HINT = {
    nav: '導覽列負責輸入與輸出資料，以及切換介面區域。兩個標籤分別指向這兩組控制項。',
    chart: '圖表由四條線組成。點擊任何一個圓點，查看該文書或事件的節點資訊區。',
    doc: '原始史料區顯示文書的基本資料與完整原文。點擊上方的 AI Skill 標籤，標示該項結果在原文中的位置。',
    ai: '研究者在本機執行 AI Skills，再把結果上載平台逐項核對。跟著步驟試一次完整流程。'
  };

  let activeRegion = '';

  function setRegion(region, options = {}) {
    activeRegion = region;
    replica.dataset.activeRegion = region;
    replica.querySelectorAll('.part1-region').forEach((element) => {
      element.classList.toggle('is-active', element.dataset.region === region);
    });
    replica.querySelectorAll('.part1-callout').forEach((callout) => {
      const belongs = callout.dataset.callout.startsWith(region);
      /* 導覽列的兩個標籤一起出現；其他區域的標籤由各自的互動控制。 */
      if (region === 'nav') callout.hidden = !belongs;
      else if (belongs) callout.hidden = true;
    });
    if (!options.silent) setProgress(`${REGION_LABEL[region]}：${REGION_HINT[region]}`);
  }

  /* 導覽列的下拉選單是展示用互動，但保留真正樣本工具的控制層級：
     點線類型在左側，工具與介面區域切換在右側。 */
  const typePop = replica.querySelector('[data-type-pop]');
  const toolsPop = replica.querySelector('[data-tools-pop]');
  replica.querySelector('[data-type-toggle]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (typePop) typePop.hidden = !typePop.hidden;
    if (toolsPop) toolsPop.hidden = true;
    setRegion('nav', { silent: true });
    setProgress('已開啟「點線類型」篩選。真正工具會依研究問題顯示或隱藏不同線型。');
  });
  replica.querySelector('[data-tool-toggle]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (toolsPop) toolsPop.hidden = !toolsPop.hidden;
    if (typePop) typePop.hidden = true;
    setRegion('nav', { silent: true });
    setProgress('已開啟「工具」選單。輸入與輸出資料集中在這裡，字級也可由此調整。');
  });
  replica.querySelectorAll('[data-region-trigger]').forEach((button) => {
    button.addEventListener('click', () => setRegion(button.dataset.regionTrigger));
  });
  replica.querySelectorAll('[data-tools-pop] button').forEach((button) => {
    button.addEventListener('click', () => {
      toolsPop.hidden = true;
      replica.querySelector('[data-toolgroup="io"]')?.classList.add('is-pointed');
      setProgress(`「${button.textContent.trim()}」是導覽列工具中的資料操作示範。`);
    });
  });

  replica.addEventListener('click', (event) => {
    if (!event.target.closest('[data-type-toggle]') && !event.target.closest('[data-type-pop]')
      && !event.target.closest('[data-tool-toggle]') && !event.target.closest('[data-tools-pop]')) {
      if (typePop) typePop.hidden = true;
      if (toolsPop) toolsPop.hidden = true;
    }
    const hotspot = event.target.closest('[data-hotspot]');
    if (hotspot) setRegion(hotspot.dataset.hotspot);
  });

  /* The explanation cards remain independent StoryMap content. The replica
     does not use JavaScript to open, close, or retarget them. */

  /* -------------------------------------------------------------- 重設 */

  const reset = () => {
    window.clearTimeout(terminalTimer);
    addedCandidates.clear();
    renderedEventItems = [];
    lanesEl.querySelectorAll('.part1-dot, .part1-dot-date').forEach((element) => element.remove());
    laneDots.forEach(addDot);
    nodePanel.hidden = true;
    docBody.querySelectorAll('mark').forEach((mark) => {
      mark.classList.remove('is-shown', 'is-located');
    });
    filterDock.querySelectorAll('.part1-filterbtn').forEach((button) => button.classList.remove('is-on'));
    replica.querySelectorAll('.part1-callout').forEach((callout) => { callout.hidden = true; });
    renderAiIdle();
    drawLinks();
    setProgress('已重設示範。點擊複本上任何一個編號標籤，重新開始。');
  };

  replica.querySelector('[data-part1-reset]')?.addEventListener('click', reset);

  /* -------------------------------------------------------------- 初始化 */

  laneDots.forEach(addDot);
  renderAiIdle();
  drawLinks();

  window.addEventListener('resize', drawLinks);
  if ('ResizeObserver' in window) new ResizeObserver(drawLinks).observe(lanesEl);
})();
