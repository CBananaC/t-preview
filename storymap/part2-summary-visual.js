/* ============================================================================
   Part 2 · 分析階段一「總結文書」— AI Skills 互動示範
   位於 2 段說明文字右側，示範 quick-summary.md／divide-into-parts.md
   兩個 Skill 如何把硃40 從「僅有原文」變成「摘要＋分段」。

   行為（桌面）：
   - 一顆會彈跳的黃色提示泡泡（RPG NPC 驚嘆號樣式）依序指向下一步：
     1 → VS Code 風格視窗（點擊或點泡泡開始打字 quick-summary.md）
     2 → divide-into-parts.md 分頁籤（第一個 Skill 打完字後出現）
     3 → 文書面板（第二個 Skill 打完字後出現，點擊套用摘要／分段）
   - 套用摘要／分段時（步驟 3），摘要卡與 1–5 號分段卡逐一展開
     （max-height／透明度動畫），每張卡片展開後以較快速度逐字打出
     其文字內容（標題不參與打字），一張打完才展開下一張。
   - 每一步都只播放一次；套用之後兩個視窗變成一般可任意點擊切換
     前後順序的浮動視窗，標題列十字圖示可拖曳移動，右下角把手可
     拖曳縮放。
   - 打字完成後，直接點擊分頁籤（quick-summary.md／divide-into-parts.md）
     可即時切換顯示完整內容，不會重播打字動畫。

   行為（手機／窄螢幕，<=900px）：
   - 兩個視窗改為直向堆疊，VS Code 視窗在上，泡泡隱藏。捲動到 VS Code
     視窗時自動依序打出兩個 Skill 並套用摘要／分段，不需分次點擊。
     不支援拖曳與縮放（版面已固定為全寬堆疊）。

   本檔只服務 #part-2-summary-content 內的 [data-part2-summary-visual]
   容器，不影響頁面其他區域。
   ========================================================================== */
(function () {
  'use strict';

  const root = document.querySelector('[data-part2-summary-visual]');
  if (!root) return;

  const stage = root.querySelector('.part2-summary-stage');
  const skillWin = root.querySelector('.part2-summary-skill-win');
  const docWin = root.querySelector('.part2-summary-doc-win');
  const skillBody = root.querySelector('.part2-summary-skill-body');
  const tabs = Array.from(root.querySelectorAll('.part2-summary-tab'));
  const docBody = root.querySelector('.part2-summary-doc-body');
  const bubble = root.querySelector('.part2-summary-bubble');
  const bubbleNum = root.querySelector('.part2-summary-bubble-num');
  if (!stage || !skillWin || !docWin || !skillBody || !docBody) return;

  const SKILLS = [
    {
      html:
        '<span class="hd"># Skill: Quick Document Summary</span>\n' +
        '<span class="cmt">Kind: summary</span>\n\n' +
        '<span class="hd">## Website Prompt</span>\n' +
        '<span class="str">用繁體中文，為上述文書寫一段更精簡、流暢的摘要\n' +
        '（約 3-5 句），突出最關鍵的人、事、時、地，\n' +
        '避免逐句翻譯。</span>\n\n' +
        '<span class="hd">## Purpose</span>\n' +
        '<span class="cmt">為任何單一文書（上奏／硃批／上諭）提供快速、通用的\n' +
        '文字摘要。此指示同時用於終端機批次執行的 summary\n' +
        '步驟，以及網站上的「進一步摘要」按鈕——同一份 Skill\n' +
        '檔案、同一段指示文字，兩種觸發方式。</span>'
    },
    {
      html:
        '<span class="hd"># Skill: Divide Document Into Parts</span>\n' +
        '<span class="cmt">Kind: divide</span>\n\n' +
        '<span class="hd">## Website Prompt</span>\n' +
        '<span class="str">將上述『原文』依內容與功能切分為數個連續段落。\n' +
        '對每一段給出：</span>\n' +
        '  <span class="kw">label</span>   段落標題（如「情報來源」「軍事部署」「請旨」）\n' +
        '  <span class="kw">summary</span> 一句繁體中文短摘要\n' +
        '  <span class="kw">excerpt</span> 該段原文，盡量逐字節錄\n\n' +
        '<span class="hd">## Purpose</span>\n' +
        '<span class="cmt">將文書切分為多個標籤化的段落，並直接在資訊面板的\n' +
        '原文上標示出來。無論是透過終端機（大量文書掃描）\n' +
        '或網站的「分段標註」按鈕（單一文書、審閱時使用，\n' +
        '用來補查大量掃描可能遺漏之處）觸發，皆使用同一段\n' +
        '指示文字。</span>'
    }
  ];

  /* phase: idle-0 -> typing-0 -> ready-1 -> typing-1 -> ready-doc -> applied */
  let phase = 'idle-0';
  let typedCount = 0;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  let bubbleFollowTarget = null;
  let bubbleRaf = null;

  function stripTags(html) { return html.replace(/<[^>]+>/g, ''); }

  function setActiveTab(index) {
    tabs.forEach((t, i) => t.classList.toggle('is-active', i === index));
  }

  function renderTabFull(index) {
    setActiveTab(index);
    skillBody.innerHTML = SKILLS[index].html;
    skillBody.scrollTop = 0;
  }

  function typeSkill(index, done) {
    const skill = SKILLS[index];
    setActiveTab(index);
    const plain = stripTags(skill.html);
    let i = 0;
    skillBody.innerHTML = '';
    const caret = document.createElement('span');
    caret.className = 'part2-summary-caret';

    const timer = setInterval(() => {
      i += 2;
      if (i >= plain.length) {
        clearInterval(timer);
        skillBody.innerHTML = skill.html;
        if (tabs[index]) tabs[index].classList.add('is-typed');
        done();
        return;
      }
      skillBody.textContent = plain.slice(0, i);
      skillBody.appendChild(caret);
      skillBody.scrollTop = skillBody.scrollHeight;
    }, 34);
  }

  function bringToFront(el, other) {
    other.classList.remove('is-top');
    el.classList.add('is-top');
  }

  /* ------------------------------------------------------------ 泡泡定位 */
  function positionBubbleAt(target) {
    if (!bubble) return;
    const targetRect = target.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    bubble.style.left = (targetRect.left - stageRect.left + targetRect.width / 2) + 'px';
    bubble.style.top = (targetRect.top - stageRect.top) + 'px';
  }

  function showBubbleOn(target, num) {
    if (!bubble) return;
    bubbleFollowTarget = target;
    positionBubbleAt(target);
    if (bubbleNum) bubbleNum.textContent = String(num);
    bubble.classList.add('is-shown');
    if (!bubbleRaf) {
      const loop = () => {
        if (bubbleFollowTarget) positionBubbleAt(bubbleFollowTarget);
        bubbleRaf = requestAnimationFrame(loop);
      };
      bubbleRaf = requestAnimationFrame(loop);
    }
  }

  function hideBubble() {
    bubbleFollowTarget = null;
    if (bubble) bubble.classList.remove('is-shown');
    if (bubbleRaf) { cancelAnimationFrame(bubbleRaf); bubbleRaf = null; }
  }

  /* ------------------------------------------------------------ 流程步驟 */
  function startFirstSkill() {
    if (phase !== 'idle-0') return;
    phase = 'typing-0';
    hideBubble();
    if (!isMobile) bringToFront(skillWin, docWin);
    typeSkill(0, () => {
      typedCount = 1;
      phase = 'ready-1';
      if (!isMobile) showBubbleOn(tabs[1], 2);
      else startSecondSkill();
    });
  }

  function startSecondSkill() {
    if (phase !== 'ready-1') return;
    phase = 'typing-1';
    hideBubble();
    typeSkill(1, () => {
      typedCount = 2;
      phase = 'ready-doc';
      skillWin.classList.add('is-done');
      if (!isMobile) showBubbleOn(docWin, 3);
      else applyResult();
    });
  }

  function applyResult() {
    if (phase !== 'ready-doc') return;
    phase = 'applied';
    hideBubble();
    if (!isMobile) bringToFront(docWin, skillWin);
    docBody.classList.add('is-fading');
    window.setTimeout(() => {
      docWin.classList.add('is-applied');
      requestAnimationFrame(() => {
        docWin.classList.add('is-applied-visible');
        revealCards();
      });
    }, 300);
  }

  /* -------------------------------------------------- 卡片展開＋快速打字 */
  const docScroll = docWin.querySelector('.part2-summary-doc-scroll');

  // 讓面板捲動跟著最新展開／打出的內容，而不是停留在第一行。
  function keepLatestInView(el) {
    if (!docScroll) return;
    const boxRect = docScroll.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.bottom > boxRect.bottom) {
      docScroll.scrollTop += (elRect.bottom - boxRect.bottom) + 14;
    } else if (elRect.top < boxRect.top) {
      docScroll.scrollTop -= (boxRect.top - elRect.top) + 14;
    }
  }

  function typeTextFast(el, fullText, done) {
    let i = 0;
    el.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'part2-summary-doc-caret';
    const timer = setInterval(() => {
      i += 5;
      if (i >= fullText.length) {
        clearInterval(timer);
        el.textContent = fullText;
        keepLatestInView(el);
        if (done) done();
        return;
      }
      el.textContent = fullText.slice(0, i);
      el.appendChild(caret);
      keepLatestInView(el);
    }, 10);
  }

  function typeTextsSequentially(texts, i, done) {
    if (i >= texts.length) { done(); return; }
    typeTextFast(texts[i], texts[i].dataset.fullText, () => {
      typeTextsSequentially(texts, i + 1, done);
    });
  }

  function revealCards() {
    const summaryEl = docWin.querySelector('.part2-summary-doc-summary');
    const partEls = Array.from(docWin.querySelectorAll('.part2-summary-doc-part'));

    const queue = [];
    if (summaryEl) {
      const p = summaryEl.querySelector('p');
      if (p) queue.push({ card: summaryEl, texts: [p] });
    }
    partEls.forEach((part) => {
      const texts = Array.from(part.querySelectorAll('.part2-summary-doc-part-summary, .part2-summary-doc-part-excerpt'));
      if (texts.length) queue.push({ card: part, texts });
    });

    // 先快取原文，再清空文字，讓卡片展開時內容是空的，之後才逐字打出。
    queue.forEach((item) => {
      item.texts.forEach((t) => {
        if (t.dataset.fullText === undefined) t.dataset.fullText = t.textContent;
        t.textContent = '';
      });
    });

    function revealNext(idx) {
      if (idx >= queue.length) return;
      const { card, texts } = queue[idx];
      card.classList.add('is-revealed');
      // 卡片展開動畫進行中（max-height 過渡）也持續跟隨捲動到底部。
      let ticks = 0;
      const followExpand = setInterval(() => {
        keepLatestInView(card);
        ticks += 1;
        if (ticks > 20) clearInterval(followExpand);
      }, 25);
      window.setTimeout(() => {
        clearInterval(followExpand);
        typeTextsSequentially(texts, 0, () => revealNext(idx + 1));
      }, 160);
    }

    revealNext(0);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === 0 && phase === 'idle-0') { startFirstSkill(); return; }
      if (i === 1 && phase === 'ready-1') { startSecondSkill(); return; }
      if (typedCount >= i + 1 || typedCount === 2) renderTabFull(i);
    });
  });

  /* ------------------------------------------------------------ 拖曳與縮放 */
  function clampNum(v, min, max) { return Math.min(Math.max(v, min), max); }

  function makeDraggable(win, handle) {
    if (!handle) return;
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      const winRect = win.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = winRect.left - stageRect.left;
      startTop = winRect.top - stageRect.top;
      bringToFront(win, win === skillWin ? docWin : skillWin);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const stageRect = stage.getBoundingClientRect();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const nextLeft = clampNum(startLeft + dx, -120, stageRect.width - 60);
      const nextTop = clampNum(startTop + dy, -30, stageRect.height - 40);
      win.style.left = nextLeft + 'px';
      win.style.top = nextTop + 'px';
    });
    ['pointerup', 'pointercancel'].forEach((evt) => {
      handle.addEventListener(evt, () => { dragging = false; });
    });
    handle.addEventListener('click', (e) => e.stopPropagation());
  }

  function makeResizable(win, handle, opts) {
    if (!handle) return;
    let resizing = false;
    let startX = 0, startY = 0, startW = 0, startH = 0;

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resizing = true;
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startW = rect.width;
      startH = rect.height;
      bringToFront(win, win === skillWin ? docWin : skillWin);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!resizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.width = clampNum(startW + dx, opts.minW, opts.maxW) + 'px';
      win.style.height = clampNum(startH + dy, opts.minH, opts.maxH) + 'px';
    });
    ['pointerup', 'pointercancel'].forEach((evt) => {
      handle.addEventListener(evt, () => { resizing = false; });
    });
    handle.addEventListener('click', (e) => e.stopPropagation());
  }

  if (!isMobile) {
    makeDraggable(skillWin, skillWin.querySelector('.part2-summary-move'));
    makeDraggable(docWin, docWin.querySelector('.part2-summary-move'));
    makeResizable(skillWin, skillWin.querySelector('.part2-summary-resize-handle'), { minW: 380, minH: 260, maxW: 800, maxH: 640 });
    makeResizable(docWin, docWin.querySelector('.part2-summary-resize-handle'), { minW: 380, minH: 320, maxW: 860, maxH: 780 });

    skillWin.addEventListener('click', () => {
      if (phase === 'idle-0') { startFirstSkill(); return; }
      if (phase === 'applied') { bringToFront(skillWin, docWin); return; }
    });
    skillWin.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (phase === 'idle-0') { startFirstSkill(); return; }
      if (phase === 'applied') { bringToFront(skillWin, docWin); return; }
    });
    docWin.addEventListener('click', () => {
      if (phase === 'ready-doc') { applyResult(); return; }
      if (phase === 'applied') { bringToFront(docWin, skillWin); return; }
    });
    docWin.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (phase === 'ready-doc') { applyResult(); return; }
      if (phase === 'applied') { bringToFront(docWin, skillWin); return; }
    });
    if (bubble) {
      bubble.addEventListener('click', (e) => {
        e.stopPropagation();
        if (phase === 'idle-0') { startFirstSkill(); return; }
        if (phase === 'ready-1') { startSecondSkill(); return; }
        if (phase === 'ready-doc') { applyResult(); return; }
      });
      showBubbleOn(tabs[0], 1);
    }
  } else {
    let seenSkill = false;
    let seenDoc = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
        if (entry.target === skillWin && !seenSkill) { seenSkill = true; startFirstSkill(); }
        if (entry.target === docWin && !seenDoc) {
          seenDoc = true;
          const waitApply = setInterval(() => {
            if (phase === 'ready-doc') { clearInterval(waitApply); applyResult(); }
            if (phase === 'applied') clearInterval(waitApply);
          }, 200);
        }
      });
    }, { threshold: [0.55] });
    io.observe(skillWin);
    io.observe(docWin);
  }
})();
