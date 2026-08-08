
const settingsButton = document.getElementById('settings-button');

document.querySelectorAll('.sample-doc-panel, .source-flow-document').forEach((panel) => {
  const minButton = panel.querySelector('.ip-min');
  const closeButton = panel.querySelector('.ip-close');
  const filterButton = panel.querySelector('.ip-filterbtn');
  const settingsButton = panel.querySelector('.ip-settingsbtn');
  minButton?.addEventListener('click', () => {
    panel.classList.toggle('is-folded');
    minButton.setAttribute('aria-expanded', String(!panel.classList.contains('is-folded')));
  });
  closeButton?.addEventListener('click', () => {
    const wrapper = panel.closest('.comparison-review-panel, .acc-panel');
    wrapper?.setAttribute('hidden', '');
  });
  [filterButton, settingsButton].forEach((button) => {
    button?.addEventListener('click', () => {
      button.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    });
  });
});
const settingsPanel = document.getElementById('site-settings-panel');
const settingsControl = document.querySelector('.site-settings-control');
const fontSizeDecrease = document.getElementById('font-size-decrease');
const fontSizeIncrease = document.getElementById('font-size-increase');
const fontSizeValue = document.getElementById('font-size-value');
const FONT_SCALE_KEY = 'intro-website-font-scale';
const FONT_SCALE_MIN = 0.55;
const FONT_SCALE_MAX = 2.2;
const FONT_SCALE_STEP = 0.05;
const clampFontScale = (value) => Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));
const readFontScale = () => {
  try {
    const saved = Number.parseFloat(localStorage.getItem(FONT_SCALE_KEY));
    return Number.isFinite(saved) ? clampFontScale(saved) : 1;
  } catch (error) {
    return 1;
  }
};
const applyFontScale = (value) => {
  const scale = clampFontScale(value);
  document.documentElement.style.setProperty('--font-scale', String(scale));
  fontSizeValue.value = `${Math.round(scale * 100)}%`;
  fontSizeValue.textContent = fontSizeValue.value;
  fontSizeDecrease.disabled = scale <= FONT_SCALE_MIN;
  fontSizeIncrease.disabled = scale >= FONT_SCALE_MAX;
  try {
    localStorage.setItem(FONT_SCALE_KEY, String(scale));
  } catch (error) {
    // Continue without persistence when storage is unavailable.
  }
};
const setSettingsOpen = (open) => {
  settingsPanel.hidden = !open;
  settingsButton.setAttribute('aria-expanded', String(open));
  settingsButton.setAttribute('aria-label', open ? '關閉網站設定' : '開啟網站設定');
};
let settingsCloseTimer;
const scheduleSettingsClose = () => {
  window.clearTimeout(settingsCloseTimer);
  settingsCloseTimer = window.setTimeout(() => {
    if (!settingsControl.matches(':hover')) setSettingsOpen(false);
  }, 100);
};
applyFontScale(readFontScale());
settingsControl.addEventListener('mouseenter', () => setSettingsOpen(true));
settingsControl.addEventListener('mouseleave', scheduleSettingsClose);
settingsButton.addEventListener('click', () => setSettingsOpen(true));
fontSizeDecrease.addEventListener('click', () => applyFontScale(readFontScale() - FONT_SCALE_STEP));
fontSizeIncrease.addEventListener('click', () => applyFontScale(readFontScale() + FONT_SCALE_STEP));
document.addEventListener('click', (event) => {
  if (!settingsPanel.hidden && !event.target.closest('.site-settings-control')) setSettingsOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !settingsPanel.hidden) {
    setSettingsOpen(false);
    settingsButton.focus();
  }
});

const compactMenuButton = document.getElementById('compact-menu-button');
const compactMenuPanel = document.getElementById('compact-menu-panel');
const compactMenuBackdrop = document.getElementById('compact-menu-backdrop');
let compactMenuCloseTimer;
const scheduleCompactMenuClose = () => {
  window.clearTimeout(compactMenuCloseTimer);
  compactMenuCloseTimer = window.setTimeout(() => {
    const menuHovered = compactMenuButton.matches(':hover')
      || compactMenuPanel.matches(':hover');
    if (!menuHovered) setCompactMenuOpen(false);
  }, 120);
};
const keepCompactMenuOpen = () => {
  window.clearTimeout(compactMenuCloseTimer);
  setCompactMenuOpen(true);
};
const setCompactMenuOpen = (open) => {
  compactMenuButton.setAttribute('aria-expanded', String(open));
  compactMenuButton.setAttribute('aria-label', open ? '關閉網站選單' : '開啟網站選單');
  compactMenuPanel.classList.toggle('is-open', open);
  compactMenuPanel.setAttribute('aria-hidden', String(!open));
  compactMenuBackdrop.classList.toggle('is-open', open);
  compactMenuBackdrop.setAttribute('aria-hidden', String(!open));
  document.documentElement.classList.toggle('compact-menu-open', open);
};
compactMenuButton.addEventListener('mouseenter', keepCompactMenuOpen);
compactMenuButton.addEventListener('mouseleave', scheduleCompactMenuClose);
compactMenuPanel.addEventListener('mouseenter', keepCompactMenuOpen);
compactMenuPanel.addEventListener('mouseleave', scheduleCompactMenuClose);
compactMenuButton.addEventListener('click', () => setCompactMenuOpen(true));
compactMenuBackdrop.addEventListener('click', () => setCompactMenuOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && compactMenuButton.getAttribute('aria-expanded') === 'true') {
    setCompactMenuOpen(false);
    compactMenuButton.focus();
  }
});

const tabs = [...document.querySelectorAll('.main-nav-link, .compact-menu-link')];
const tabPanels = [...document.querySelectorAll('[data-tab-panel]')];
const introDropdown = document.querySelector('.nav-dropdown');
const introDropdownTrigger = introDropdown.querySelector('.nav-dropdown-trigger');
const introDropdownMenu = introDropdown.querySelector('.nav-dropdown-menu');
const workflowNodes = [...document.querySelectorAll('.workflow-node')];
let introDropdownCloseTimer;
const setIntroDropdownOpen = (open) => {
  window.clearTimeout(introDropdownCloseTimer);
  introDropdown.classList.toggle('open', open);
  introDropdownTrigger.setAttribute('aria-expanded', String(open));
};
introDropdown.addEventListener('mouseenter', () => setIntroDropdownOpen(true));
const scheduleIntroDropdownClose = () => {
  window.clearTimeout(introDropdownCloseTimer);
  introDropdownCloseTimer = window.setTimeout(() => {
    const pointerInside = introDropdown.matches(':hover') || introDropdownMenu.matches(':hover');
    const focusInside = introDropdown.contains(document.activeElement);
    if (!pointerInside && !focusInside) setIntroDropdownOpen(false);
  }, 80);
};
introDropdown.addEventListener('mouseleave', scheduleIntroDropdownClose);
introDropdownMenu.addEventListener('mouseenter', () => setIntroDropdownOpen(true));
introDropdownMenu.addEventListener('mouseleave', scheduleIntroDropdownClose);
introDropdown.addEventListener('focusin', () => setIntroDropdownOpen(true));
introDropdown.addEventListener('focusout', scheduleIntroDropdownClose);
const panelForHash = (hash) => {
  if (hash === '#intro' || hash.startsWith('#intro-')) return 'intro';
  if (hash === '#part-1') return 'part-1';
  if (hash === '#part-2') return 'part-2';
  if (hash === '#part-3' || hash.startsWith('#part-3-')) return 'part-3';
  return 'cover';
};
const setActiveTab = (tabName, { updateHash = true, scrollTarget = null } = {}) => {
  const panel = tabPanels.find((item) => item.dataset.tabPanel === tabName);
  if (!panel) return;
  tabPanels.forEach((item) => { item.hidden = item !== panel; });
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.navTarget === tabName));
  introDropdown.classList.toggle('active', tabName === 'intro');
  setIntroDropdownOpen(false);
  setCompactMenuOpen(false);
  if (updateHash) history.pushState(null, '', scrollTarget || `#${tabName}`);
  if (scrollTarget) {
    window.requestAnimationFrame(() => document.querySelector(scrollTarget)?.scrollIntoView({ block: 'start' }));
  } else {
    window.scrollTo(0, 0);
  }
};
tabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveTab(tab.dataset.navTarget);
  });
});
document.querySelector('[data-cover-target="intro"]')?.addEventListener('click', (event) => {
  event.preventDefault();
  setActiveTab('intro');
});
introDropdown.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = link.dataset.workflowTarget || link.getAttribute('href');
    const tabName = panelForHash(target);
    const scrollTarget = tabName === 'intro' && target.startsWith('#intro-') ? target : null;
    setActiveTab(tabName, { scrollTarget });
  });
});
workflowNodes.forEach((node) => {
  node.addEventListener('click', () => {
    workflowNodes.forEach((item) => item.classList.toggle('is-selected', item === node));
  });
});

/* 量測每一節文字欄的高度，寫入該節的 --text-h。
   storymap-cards.css 的 --visual-x（倍數）便以此為基準計算視覺元素高度。
   文字欄高度會隨字級設定、視窗寬度、小卡展開而改變，因此持續觀察。 */
const measureTextColumns = () => {
  const groups = [...document.querySelectorAll('.lay-split, .lay-acc')];
  if (!groups.length) return;
  const apply = () => {
    groups.forEach((group) => {
      const textColumn = group.querySelector('.lay-copy, .acc-track');
      if (!textColumn) return;
      const height = Math.round(textColumn.getBoundingClientRect().height);
      if (height > 0) group.style.setProperty('--text-h', `${height}px`);
    });
  };
  apply();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(apply);
    groups.forEach((group) => {
      const textColumn = group.querySelector('.lay-copy, .acc-track');
      if (textColumn) observer.observe(textColumn);
    });
  }
  window.addEventListener('resize', apply);
};
measureTextColumns();

/* 硃119消息來源標註：外置來源框跟隨原文引文位置，並在文件內捲動或
   視窗尺寸改變時重畫連線。這組標註是教學網站新增的視覺層，不修改審閱工具。 */
let sourceFlowRefreshFrame = 0;
const refreshSourceFlowConnectors = () => {
  sourceFlowRefreshFrame = 0;
  document.querySelectorAll('[data-source-flow]').forEach((visual) => {
    const svg = visual.querySelector('.source-connector-layer');
    if (!svg) return;
    const rootRect = visual.getBoundingClientRect();
    const width = Math.round(visual.clientWidth);
    const height = Math.round(visual.clientHeight);
    if (!width || !height) return;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.innerHTML = '';
    const marks = new Map();
    visual.querySelectorAll('[data-source-highlight]').forEach((mark) => {
      const key = mark.dataset.sourceHighlight;
      if (key) marks.set(key, [...(marks.get(key) || []), mark]);
    });

    const scrollViewport = visual.querySelector('.ip-scroll')?.getBoundingClientRect();
    const pageViewport = { top: 0, bottom: window.innerHeight };
    const panelHeaderBottom = [
      visual.querySelector('.ip-head')?.getBoundingClientRect(),
      visual.querySelector('.ip-filterdock')?.getBoundingClientRect()
    ].filter(Boolean).reduce(
      (bottom, rect) => Math.max(bottom, rect.bottom),
      scrollViewport?.top ?? pageViewport.top
    );
    visual.querySelectorAll('.source-callouts').forEach((callouts) => {
      let previousBottom = 8;
      const isRight = callouts.classList.contains('source-callouts-right');
      callouts.querySelectorAll('[data-source-bubble]').forEach((bubble) => {
        const key = bubble.dataset.sourceBubble;
        const markList = marks.get(key) || [];
        if (!markList.length) return;
        const contentTop = Math.max(panelHeaderBottom, scrollViewport?.top ?? pageViewport.top);
        const contentBottom = Math.min(scrollViewport?.bottom ?? pageViewport.bottom, pageViewport.bottom);
        const visibleMarks = markList
          .map((mark) => ({ mark, rect: mark.getBoundingClientRect() }))
          .filter(({ rect }) => !scrollViewport
            || (rect.top >= contentTop
              && rect.bottom > contentTop
              && rect.top < contentBottom));
        const markIsVisible = visibleMarks.length > 0;
        bubble.hidden = !markIsVisible;
        bubble.setAttribute('aria-hidden', String(!markIsVisible));
        if (!markIsVisible) {
          bubble.style.removeProperty('--source-bubble-top');
          return;
        }
        const markRect = visibleMarks[0].rect;
        const bubbleHeight = bubble.getBoundingClientRect().height;
        const targetY = markRect.top + markRect.height / 2 - rootRect.top;
        const maxBubbleTop = Math.max(8, height - bubbleHeight - 8);
        let bubbleTop = Math.max(8, Math.min(maxBubbleTop, targetY - bubbleHeight / 2));
        if (bubbleTop < previousBottom + 10) bubbleTop = Math.min(maxBubbleTop, previousBottom + 10);
        bubble.style.setProperty('--source-bubble-top', `${Math.round(bubbleTop)}px`);
        previousBottom = bubbleTop + bubbleHeight;

        const bubbleRect = bubble.getBoundingClientRect();
        const x1 = (isRight ? bubbleRect.left : bubbleRect.right) - rootRect.left;
        const y1 = bubbleRect.top + bubbleRect.height / 2 - rootRect.top;
        const x2 = Math.max(0, Math.min(width, (isRight ? markRect.right : markRect.left) - rootRect.left));
        const y2 = Math.max(8, Math.min(height - 8, targetY));
        const color = getComputedStyle(bubble).getPropertyValue('--source-color').trim();

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('source-connector-line');
        line.style.stroke = color;
        line.setAttribute('x1', String(Math.round(x1)));
        line.setAttribute('y1', String(Math.round(y1)));
        line.setAttribute('x2', String(Math.round(x2)));
        line.setAttribute('y2', String(Math.round(y2)));
        svg.appendChild(line);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.classList.add('source-connector-dot');
        dot.style.fill = color;
        dot.setAttribute('cx', String(Math.round(x2)));
        dot.setAttribute('cy', String(Math.round(y2)));
        dot.setAttribute('r', '3.5');
        svg.appendChild(dot);
      });
    });
  });
};
const scheduleSourceFlowConnectorRefresh = () => {
  if (sourceFlowRefreshFrame) return;
  sourceFlowRefreshFrame = window.requestAnimationFrame(refreshSourceFlowConnectors);
};
window.addEventListener('resize', scheduleSourceFlowConnectorRefresh);
window.addEventListener('scroll', scheduleSourceFlowConnectorRefresh, { passive: true });
document.querySelectorAll('[data-source-flow]').forEach((visual) => {
  visual.querySelector('.ip-scroll')?.addEventListener('scroll', scheduleSourceFlowConnectorRefresh, { passive: true });
  visual.querySelectorAll('.source-callout').forEach((callout) => {
    callout.addEventListener('pointerenter', scheduleSourceFlowConnectorRefresh);
    callout.addEventListener('pointerleave', scheduleSourceFlowConnectorRefresh);
    callout.addEventListener('focusin', scheduleSourceFlowConnectorRefresh);
    callout.addEventListener('focusout', scheduleSourceFlowConnectorRefresh);
  });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleSourceFlowConnectorRefresh).observe(visual);
});
scheduleSourceFlowConnectorRefresh();

/* 小卡（點擊展開）＋對應視覺元素。
   行為：初始全部收合；點標題展開／收合，不影響其他已展開的卡；
   點已展開卡片的內文，只把右側畫面切換到該卡，不收合。 */
document.querySelectorAll('[data-acc]').forEach((group) => {
  const cards = [...group.querySelectorAll('[data-acc-card]')];
  const panels = [...group.querySelectorAll('[data-acc-panel]')];
  if (!cards.length) return;

  const showPanel = (id) => {
    panels.forEach((panel) => {
      const active = panel.dataset.accPanel === id;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    cards.forEach((card) => card.classList.toggle('is-showing', card.dataset.accCard === id));
    scheduleSourceFlowConnectorRefresh();
  };

  cards.forEach((card) => {
    const heading = card.querySelector('[data-acc-target]');
    const body = card.querySelector('.acc-body');
    card.classList.remove('is-open');
    if (heading) heading.setAttribute('aria-expanded', 'false');

    /* 上半（標題）：展開／收合 */
    heading?.addEventListener('click', () => {
      const willOpen = !card.classList.contains('is-open');
      card.classList.toggle('is-open', willOpen);
      heading.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        showPanel(card.dataset.accCard);
      } else {
        const stillOpen = cards.filter((item) => item.classList.contains('is-open'));
        showPanel(stillOpen.length ? stillOpen[stillOpen.length - 1].dataset.accCard : cards[0].dataset.accCard);
      }
    });

    heading?.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const headings = cards.map((item) => item.querySelector('[data-acc-target]')).filter(Boolean);
      const index = headings.indexOf(heading);
      const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      headings[(index + step + headings.length) % headings.length].focus();
    });

    /* 下半（內文）：只切換右側畫面 */
    if (body) {
      body.setAttribute('role', 'button');
      body.setAttribute('tabindex', '0');
      body.setAttribute('aria-label', '顯示此項目的視覺元素');
      body.addEventListener('click', () => showPanel(card.dataset.accCard));
      body.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        showPanel(card.dataset.accCard);
      });
    }
  });

  showPanel(cards[0].dataset.accCard);
});

/* 手機／窄螢幕：清單列進入閱讀區時，以動畫展開對應的視覺面板。
   Part 3 的硃113／硃119兩列是完整通信示意，維持固定展開，不套用這個收合動畫。 */
const initResponsiveSequentialRows = () => {
  const responsiveQuery = window.matchMedia('(pointer: coarse) and (hover: none), (max-width: 1040px)');
  document.querySelectorAll('[data-sequential-scroll]').forEach((group) => {
    const cards = [...group.querySelectorAll('[data-acc-card]')];
    const panels = [...group.querySelectorAll('[data-acc-panel]')];
    const panelById = new Map(panels.map((panel) => [panel.dataset.accPanel, panel]));
    const rows = cards
      .map((card) => ({ card, panel: panelById.get(card.dataset.accCard) }))
      .filter(({ panel }) => panel);
    if (!rows.length) return;

    const isFixedSourceRow = (panel) => (
      group.closest('#intro-1-3-a')
      && ['difficulty-relations', 'difficulty-network'].includes(panel.dataset.accPanel)
    );
    let scrollFrame = 0;
    const updateRows = () => {
      scrollFrame = 0;
      if (!responsiveQuery.matches) return;
      if (!group.getClientRects().length) return;
      const triggerLine = window.innerHeight * 0.68;
      rows.forEach(({ card, panel }) => {
        if (isFixedSourceRow(panel) || panel.classList.contains('is-scroll-open')) return;
        const rect = card.getBoundingClientRect();
        if (rect.top <= triggerLine) {
          card.classList.add('is-scroll-open');
          panel.classList.add('is-scroll-open');
        }
      });
    };
    const requestRowUpdate = () => {
      if (!responsiveQuery.matches || scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateRows);
    };
    const resetRows = () => {
      rows.forEach(({ card, panel }) => {
        card.classList.remove('is-scroll-open');
        panel.classList.remove('is-scroll-open');
      });
      if (responsiveQuery.matches) requestRowUpdate();
    };

    window.addEventListener('scroll', requestRowUpdate, { passive: true });
    window.addEventListener('resize', requestRowUpdate, { passive: true });
    const tabPanel = group.closest('[data-tab-panel]');
    if (tabPanel && 'MutationObserver' in window) {
      new MutationObserver(requestRowUpdate).observe(tabPanel, {
        attributes: true,
        attributeFilter: ['hidden']
      });
    }
    if (responsiveQuery.addEventListener) responsiveQuery.addEventListener('change', resetRows);
    else responsiveQuery.addListener(resetRows);
    requestRowUpdate();
  });
};
initResponsiveSequentialRows();

document.addEventListener('click', (event) => {
  if (!introDropdown.contains(event.target)) setIntroDropdownOpen(false);
});
const sections = [...document.querySelectorAll('.story[data-tab], [data-intro-card][data-tab]')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target.dataset.nav || '#' + entry.target.id;
    const workflowTarget = entry.target.id ? '#' + entry.target.id : target;
    workflowNodes.forEach((node) => node.classList.toggle(
      'is-selected',
      node.dataset.workflowTarget === workflowTarget || node.dataset.workflowTarget === target
    ));
  });
}, { threshold: 0.35 });
sections.forEach((section) => observer.observe(section));

/* 圖片放大檢視：全站共用一個浮層。點圖片開啟，點 X 或點外部深色區域關閉，
   也支援 Esc 鍵關閉。 */
const photoLightbox = (() => {
  const overlay = document.createElement('div');
  overlay.className = 'photo-lightbox';
  overlay.innerHTML = `
    <figure class="photo-lightbox-figure">
      <button type="button" class="photo-lightbox-close" aria-label="關閉放大檢視">×</button>
      <img alt="">
      <figcaption class="photo-lightbox-caption" hidden></figcaption>
    </figure>
    <button type="button" class="photo-lightbox-nav prev" aria-label="上一頁">‹</button>
    <button type="button" class="photo-lightbox-nav next" aria-label="下一頁">›</button>
    <div class="photo-lightbox-counter" aria-live="polite" hidden></div>
  `;
  document.body.appendChild(overlay);
  const img = overlay.querySelector('img');
  const caption = overlay.querySelector('.photo-lightbox-caption');
  const closeBtn = overlay.querySelector('.photo-lightbox-close');
  const prevBtn = overlay.querySelector('.photo-lightbox-nav.prev');
  const nextBtn = overlay.querySelector('.photo-lightbox-nav.next');
  const counter = overlay.querySelector('.photo-lightbox-counter');
  let lastFocused = null;
  let pages = [];
  let pageIndex = 0;

  const close = () => {
    overlay.classList.remove('is-open');
    img.src = '';
    pages = [];
    pageIndex = 0;
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    counter.hidden = true;
    if (lastFocused) lastFocused.focus();
  };
  const renderPage = () => {
    const page = pages[pageIndex];
    if (!page) return;
    img.src = page.src;
    img.alt = page.alt || '';
    if (page.captionHtml) { caption.innerHTML = page.captionHtml; caption.hidden = false; }
    else if (page.caption) { caption.textContent = page.caption; caption.hidden = false; }
    else { caption.textContent = ''; caption.hidden = true; }
    const hasNavigation = pages.length > 1;
    prevBtn.hidden = !hasNavigation;
    nextBtn.hidden = !hasNavigation;
    counter.hidden = !hasNavigation;
    counter.textContent = hasNavigation ? `頁 ${pageIndex + 1} / ${pages.length}` : '';
  };
  const open = (src, alt, captionText, triggerEl) => {
    lastFocused = triggerEl || null;
    pages = [{ src, alt, caption: captionText }];
    pageIndex = 0;
    renderPage();
    overlay.classList.add('is-open');
    closeBtn.focus();
  };
  const escapeCaptionHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const openGallery = (galleryPages, startIndex, {
    title = '', captionTitle = title, showPageNumber = true, description = '', descriptionHtml = ''
  } = {}, triggerEl) => {
    /* 接受純圖片路徑，也接受帶有個別說明的頁面物件；既有圖庫仍可只傳路徑。 */
    const validPages = galleryPages
      .map((page) => typeof page === 'string' ? { src: page } : page)
      .filter((page) => page && (page.src || page.image));
    if (!validPages.length) return;
    lastFocused = triggerEl || null;
    pages = validPages.map((item, i) => {
      const src = item.src || item.image;
      const pageLabel = showPageNumber ? `第 ${i + 1} 頁` : '';
      const itemTitle = item.title || captionTitle;
      const itemDescription = item.description ?? description;
      const itemDescriptionHtml = item.descriptionHtml ?? descriptionHtml;
      return {
        src,
        alt: item.alt || `${title} ${pageLabel}`.trim(),
        caption: item.caption || [itemTitle, pageLabel, itemDescription].filter(Boolean).join('｜'),
        captionHtml: item.captionHtml || (itemDescriptionHtml
          ? [itemTitle && escapeCaptionHtml(itemTitle), pageLabel, itemDescriptionHtml].filter(Boolean).join('｜')
          : ''
        )
      };
    });
    pageIndex = Math.max(0, Math.min(pages.length - 1, startIndex || 0));
    renderPage();
    overlay.classList.add('is-open');
    closeBtn.focus();
  };

  const showPage = (nextIndex) => {
    if (pages.length < 2) return;
    pageIndex = (nextIndex + pages.length) % pages.length;
    renderPage();
  };

  /* 點外部深色區域（不是圖片本身）即關閉 */
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target === overlay.firstElementChild) close();
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => showPage(pageIndex - 1));
  nextBtn.addEventListener('click', () => showPage(pageIndex + 1));
  document.addEventListener('keydown', (event) => {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') showPage(pageIndex - 1);
    if (event.key === 'ArrowRight') showPage(pageIndex + 1);
  });

  prevBtn.hidden = true;
  nextBtn.hidden = true;
  counter.hidden = true;
  return { open, openGallery, close };
})();

/* 圖片畫廊：左右翻頁、乾淨圖片、下方說明（預設只顯示標題，滑鼠移入展開）。
   每個 [data-photo-gallery] 讀取自己的 <script type="application/json"
   data-photo-gallery-data> 作為圖片與說明來源。若只有來源而沒有段落，直接顯示完整引註；
   點擊圖片本身可開啟放大檢視。 */
const PHOTO_GALLERY_MOBILE_MQ = window.matchMedia('(pointer: coarse) and (hover: none), (max-width: 1040px)');
const PHOTO_GALLERY_EXPAND_RATIO = 0.5; /* 圖片頂端越過螢幕中線後展開 */
const PHOTO_GALLERY_COLLAPSE_RATIO = 0.56; /* 向上離開後多留一點緩衝，避免來回閃動 */
document.querySelectorAll('[data-photo-gallery]').forEach((gallery) => {
  const dataScript = gallery.querySelector('[data-photo-gallery-data]');
  if (!dataScript) return;
  let pages = [];
  try {
    pages = JSON.parse(dataScript.textContent);
  } catch (error) {
    return;
  }
  if (!Array.isArray(pages) || !pages.length) return;

  const stage = gallery.querySelector('.photo-gallery-stage');
  const body = gallery.querySelector('.photo-gallery-body');
  if (!stage || !body) return;

/* 手機／窄螢幕電腦：先保持「圖片＋收合標題列」。只要圖片頂端已經
   到達或越過螢幕中線，就立即展開，不要求一定要先經歷一次越線捲動。
   這裡只負責加／移除狀態 class，展開高度與過渡仍由 storymap.css 控制。 */
  let scrollFrame = 0;
  let previousScrollY = window.scrollY;
  const updateMobileScrollExpansion = () => {
    scrollFrame = 0;
    if (!PHOTO_GALLERY_MOBILE_MQ.matches || !body.getClientRects().length) return;
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY >= previousScrollY;
    const photoTop = stage.getBoundingClientRect().top;
    const expandLine = window.innerHeight * PHOTO_GALLERY_EXPAND_RATIO;
    const collapseLine = window.innerHeight * PHOTO_GALLERY_COLLAPSE_RATIO;
    if (scrollingDown && photoTop <= expandLine) body.classList.add('is-expanded');
    else if (!scrollingDown && photoTop >= collapseLine) body.classList.remove('is-expanded');
    previousScrollY = currentScrollY;
  };
  const requestMobileScrollExpansion = () => {
    if (!PHOTO_GALLERY_MOBILE_MQ.matches) return;
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateMobileScrollExpansion);
  };
  window.addEventListener('scroll', requestMobileScrollExpansion, { passive: true });
  window.addEventListener('resize', () => {
    previousScrollY = window.scrollY;
    if (PHOTO_GALLERY_MOBILE_MQ.matches) updateMobileScrollExpansion();
  }, { passive: true });
  const resetMobileScrollExpansion = () => {
    body.classList.remove('is-expanded');
    previousScrollY = window.scrollY;
    if (PHOTO_GALLERY_MOBILE_MQ.matches) requestMobileScrollExpansion();
  };
  if (PHOTO_GALLERY_MOBILE_MQ.addEventListener) PHOTO_GALLERY_MOBILE_MQ.addEventListener('change', resetMobileScrollExpansion);
  else PHOTO_GALLERY_MOBILE_MQ.addListener(resetMobileScrollExpansion);

  /* 當引言／其他分頁剛變為可見時，圖片可能已經位於中線上方；立即重算，
     不必等待下一次捲動事件。 */
  const tabPanel = gallery.closest('[data-tab-panel]');
  if (tabPanel && 'MutationObserver' in window) {
    new MutationObserver(requestMobileScrollExpansion).observe(tabPanel, {
      attributes: true,
      attributeFilter: ['hidden']
    });
  }

  stage.innerHTML = '';
  pages.forEach((page, i) => {
    const frame = document.createElement('div');
    frame.className = 'photo-gallery-frame' + (i === 0 ? ' is-active' : '');
    frame.dataset.frame = String(i);
    const img = document.createElement('img');
    img.src = page.image;
    img.alt = page.alt || '';
    /* 每張圖片保留自己的顯示設定；切換圖片時不會沿用上一張的尺寸或裁切方式。 */
    if (page.fit) img.style.setProperty('--photo-fit', page.fit);
    if (page.position) img.style.setProperty('--photo-position', page.position);
    if (page.zoom) img.style.setProperty('--photo-zoom', String(page.zoom));
    /* 每張圖片的裁切／對齊／縮放一律在 storymap-cards.css 用
       :nth-of-type(N) 設定（N = 第幾張，從 1 開始），不在這裡處理，
       避免行內樣式蓋過 CSS 設定而難以調整。 */
    /* 點圖片本身開啟放大檢視：一律顯示完整原圖（不套用上面的裁切／縮放），
       說明文字帶標題與來源，方便在放大狀態下核對。 */
    img.addEventListener('click', () => {
      const captionParts = [page.title, page.source?.text].filter(Boolean);
      photoLightbox.open(page.image, page.alt || page.title, captionParts.join('｜'), img);
    });
    frame.appendChild(img);
    stage.appendChild(frame);
  });
  const frames = [...stage.querySelectorAll('.photo-gallery-frame')];

  if (pages.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button'; prevBtn.className = 'photo-gallery-nav prev'; prevBtn.setAttribute('aria-label', '上一張');
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button'; nextBtn.className = 'photo-gallery-nav next'; nextBtn.setAttribute('aria-label', '下一張');
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
    const counter = document.createElement('div');
    counter.className = 'photo-gallery-counter';
    stage.append(prevBtn, nextBtn, counter);

    let index = 0;
    const show = (next) => {
      index = (next + frames.length) % frames.length;
      frames.forEach((frame, i) => {
        frame.classList.toggle('is-active', i === index);
        frame.hidden = i !== index;
      });
      counter.textContent = `圖 ${index + 1} / ${frames.length}`;
      /* A touch-expanded page must not leave its larger information area on
         the next page.  Reset the transient state before rendering the new
         page; a desktop hover can still expand it again naturally. */
      body.classList.remove('is-expanded');
      body.scrollTop = 0;
      if (pages[index].bodyMaxHeight) body.style.setProperty('--gallery-body-max-h', pages[index].bodyMaxHeight);
      else body.style.removeProperty('--gallery-body-max-h');
      renderBody(pages[index]);
    };
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));
    gallery.setAttribute('tabindex', '0');
    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    show(0);
  } else {
    renderBody(pages[0]);
  }

  function renderBody(page) {
    /* Keep each page's optional layout override independent.  This also
       makes a page with a short description return to its own area after a
       previous page with a longer description was expanded. */
    body.classList.remove('is-expanded');
    body.scrollTop = 0;
    const paragraphs = (page.paragraphs || []).filter(Boolean);
    const hasDescription = paragraphs.length > 0;
    const hasSource = Boolean(page.source?.text);
    const paras = paragraphs.map((p) => `<p class="photo-gallery-desc">${p}</p>`).join('');
    const source = page.source
      ? `<p class="photo-gallery-source"><a href="${page.source.href}" target="_blank" rel="noopener noreferrer">${page.source.text} ↗</a></p>`
      : '';
    const title = page.titleHref
      ? `<a class="photo-gallery-title-link" href="${page.titleHref}" target="_blank" rel="noopener noreferrer">${page.title}</a>`
      : page.title;
    body.classList.toggle('is-source-only', !hasDescription && hasSource);
    body.innerHTML = `
      <h3 class="photo-gallery-title">${title}</h3>
      ${hasDescription ? `<div class="photo-gallery-more"><div>
        ${paras}
        ${source}
      </div></div>
      <p class="photo-gallery-hint">閱讀更多</p>` : source}
    `;
  }

  /* 觸控裝置：點擊說明區展開／收合 */
  body.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    if (window.matchMedia('(hover: none)').matches) body.classList.toggle('is-expanded');
  });

  /* 初次建立畫廊後也檢查目前位置，涵蓋圖片一開始已在螢幕中線上方的情況。 */
  requestMobileScrollExpansion();
});

/* OCR PDF page previews use one delegated listener so the click remains active
   while the animation replaces the visible page image. */
document.addEventListener('click', (event) => {
  const img = event.target;
  if (!img || img.getAttribute?.('data-ocr-page-img') === null) return;
  const fileStack = img.parentElement?.parentElement;
  const script = fileStack?.querySelector('script[data-ocr-pages]');
  if (!fileStack || !script) return;
  let pages = [];
  try {
    pages = JSON.parse(script.textContent).filter(Boolean);
  } catch (error) {
    return;
  }
  if (!pages.length) return;
  const currentSrc = String(img.getAttribute('src') || img.src || '');
  const currentIndex = pages.findIndex((src) => currentSrc.endsWith(String(src)));
  const documentMeta = fileStack.classList.contains('handwritten')
    ? {
        title: '為奏彰化失陷已調兵赴臺事｜黃仕簡｜1786/12/10 sent',
        descriptionHtml: '黃仕簡，〈為奏彰化失陷已調兵赴臺事〉（1786/12/10），〈奏聞臺灣彰化縣賊匪殺官陷城及奴才辦理赴剿緣由事〉，《宮中檔奏摺—乾隆朝》，乾隆51年12月10日，故宮075543號，件1。國立故宮博物院，<a href="https://qingarchives.npm.edu.tw/index.php?act=Display/image/8760364P-6I=Vw#08l" target="_blank" rel="noopener noreferrer">《清代檔案檢索系統》</a>（<a href="https://qingarchives.npm.edu.tw/index.php?act=Display/image/8760364P-6I=Vw/pdf#08l" target="_blank" rel="noopener noreferrer">PDF影像</a>），瀏覽日期：2026/08/04。'
      }
    : {
        title: '為奏彰化失陷已調兵赴臺事｜黃仕簡｜1786/12/10 sent',
        description: '黃仕簡，〈為奏彰化失陷已調兵赴臺事〉（1786/12/10），《明清台灣檔案匯編》，第30冊，頁80，硃25。'
      };
  photoLightbox.openGallery(pages, currentIndex < 0 ? 0 : currentIndex, {
    title: fileStack.getAttribute('data-ocr-document-title') || documentMeta.title,
    captionTitle: '',
    showPageNumber: false,
    description: fileStack.getAttribute('data-ocr-document-description') || documentMeta.description,
    descriptionHtml: documentMeta.descriptionHtml
  }, img);
});

const routeGalleryPages = [
  {
    image: '../Visual Material/印版平定台湾战图册6.png',
    alt: '《印版平定臺灣戰圖冊》的戰事圖像',
    title: '奏摺抵達御前',
    text: '柴大紀的奏摺經福建、江蘇、山東的驛站輾轉傳遞，歷時一個月，在一月二日始送達御前。乾隆帝硃批：「已有旨了。」',
    source: '柴大紀奏摺傳遞記錄'
  },
  {
    image: '../Visual Material/img2_4_2.jpg',
    alt: '清代軍事文獻的冊頁與裝幀',
    title: '軍機處登記同日軍情',
    text: '乾隆帝硃批後，奏摺交由軍機處登記和辦理。根據當日的《軍機處隨手登記檔》，乾隆帝當天不僅收到柴大紀的奏摺，還包括閩浙總督常青、福建巡撫徐嗣曾與福建水師提督黃仕簡所上的奏摺，同樣奏報臺灣的軍情。',
    source: '《軍機處隨手登記檔》'
  },
  {
    image: 'taiwan-route-source-page.png',
    alt: '《乾隆重要戰爭之軍需研究》〈台灣之役〉頁面',
    title: '諭旨廷寄與柴大紀',
    text: '據《登記檔》所載，乾隆帝當日下了兩道諭旨，其中一道〈諭閩浙總督常青等總須鎮定持重並俟兵丁到齊約期夾攻〉也廷寄給了柴大紀，嘉許了他嚴守臺灣府城，並命他迅速剿滅匪徒，收復失地。',
    source: '《登記檔》所載諭旨'
  }
];

const animateRouteLayer = (map, direction) => new Promise((resolve) => {
  const outbound = map.querySelector('.route-line-outbound');
  const returning = map.querySelector('.route-line-return');
  const layer = direction === 'return' ? returning : outbound;
  if (!layer) {
    resolve();
    return;
  }
  if (direction === 'return') {
    returning?.classList.remove('is-visible', 'is-running');
  } else {
    [outbound, returning].forEach((item) => item?.classList.remove('is-visible', 'is-running'));
  }
  window.requestAnimationFrame(() => {
    layer.classList.add('is-visible', 'is-running');
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000;
    window.setTimeout(resolve, duration);
  });
});

const initRouteMap = (map) => {
  const taiwanPin = map.querySelector('[data-route-pin="taiwan"]');
  const beijingPin = map.querySelector('[data-route-pin="beijing"]');
  const taiwanInfo = map.querySelector('[data-route-info="taiwan"]');
  const beijingInfo = map.querySelector('[data-route-info="beijing"]');
  const line = map.querySelector('.route-line-svg');
  if (!taiwanPin || !beijingPin || !taiwanInfo || !beijingInfo || !line) return;

  const state = {
    page: 0,
    routeStarted: false,
    routeRunning: false
  };
  const galleryImage = beijingInfo.querySelector('[data-gallery-image]');
  const galleryPage = beijingInfo.querySelector('[data-gallery-page]');
  const galleryTitle = beijingInfo.querySelector('[data-gallery-title]');
  const galleryText = beijingInfo.querySelector('[data-gallery-text]');
  const gallerySource = beijingInfo.querySelector('[data-gallery-source]');
  const galleryPrevious = beijingInfo.querySelector('[data-gallery-prev]');
  const galleryNext = beijingInfo.querySelector('[data-gallery-next]');

  const renderGalleryPage = (pageIndex, { replayRoute = false } = {}) => {
    state.page = Math.max(0, Math.min(routeGalleryPages.length - 1, pageIndex));
    const page = routeGalleryPages[state.page];
    galleryImage.src = page.image;
    galleryImage.alt = page.alt;
    ['fit', 'position', 'zoom'].forEach((key) => galleryImage.style.removeProperty(`--route-photo-${key}`));
    if (page.fit) galleryImage.style.setProperty('--route-photo-fit', page.fit);
    if (page.position) galleryImage.style.setProperty('--route-photo-position', page.position);
    if (page.zoom) galleryImage.style.setProperty('--route-photo-zoom', String(page.zoom));
    galleryTitle.textContent = page.title;
    galleryText.textContent = page.text;
    gallerySource.textContent = page.source;
    galleryPage.textContent = `${state.page + 1} / ${routeGalleryPages.length}`;
    galleryPrevious.disabled = state.page === 0;
    galleryNext.textContent = state.page === routeGalleryPages.length - 1 ? '再次播放路線' : '下一頁';
    if (replayRoute && state.page === routeGalleryPages.length - 1) {
      window.setTimeout(() => animateRoute({ replay: true }), 120);
    }
  };

  const revealBeijing = () => {
    beijingPin.removeAttribute('hidden');
    beijingInfo.hidden = false;
  };

  const animateRoute = async ({ replay = false } = {}) => {
    if (state.routeRunning) return;
    state.routeRunning = true;
    await animateRouteLayer(map, replay ? 'return' : 'outbound');
    if (!replay) revealBeijing();
    state.routeRunning = false;
  };

  const revealTaiwan = () => {
    taiwanInfo.hidden = false;
    taiwanPin.classList.add('is-active');
    taiwanPin.setAttribute('aria-expanded', 'true');
    if (!state.routeStarted) {
      state.routeStarted = true;
      window.setTimeout(() => animateRoute(), 140);
    }
  };

  const activatePin = (pin) => {
    if (pin === taiwanPin) revealTaiwan();
    if (pin === beijingPin && !beijingPin.hasAttribute('hidden')) beijingInfo.hidden = false;
  };

  [taiwanPin, beijingPin].forEach((pin) => {
    pin.addEventListener('click', () => activatePin(pin));
    pin.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activatePin(pin);
    });
  });

  taiwanInfo.querySelector('[data-route-close]').addEventListener('click', () => {
    taiwanInfo.hidden = true;
    taiwanPin.classList.remove('is-active');
    taiwanPin.setAttribute('aria-expanded', 'false');
  });
  beijingInfo.querySelector('[data-route-close]').addEventListener('click', () => { beijingInfo.hidden = true; });
  galleryImage.addEventListener('click', () => {
    const page = routeGalleryPages[state.page];
    photoLightbox.open(page.image, page.alt, `${page.title}｜${page.source}`, galleryImage);
  });
  galleryPrevious.addEventListener('click', () => renderGalleryPage(state.page - 1));
  galleryNext.addEventListener('click', () => {
    if (state.page < routeGalleryPages.length - 1) {
      renderGalleryPage(state.page + 1, { replayRoute: state.page + 1 === routeGalleryPages.length - 1 && state.routeStarted });
    } else {
      animateRoute({ replay: true });
    }
  });
  renderGalleryPage(0);
};
document.querySelectorAll('[data-route-map]').forEach(initRouteMap);

/* ---------------------------------------------------------------------------
   GIF 示範的浮動標註：把每張說明卡片連到 GIF 上對應的圓點。
   卡片與圓點的位置都由 storymap-cards.css 的變數決定，這裡只負責依照兩者
   當下的實際位置，計算連接線的角度與長度並畫出來；視窗縮放或版面變動時
   會自動重畫，因此不需要在 CSS 裡手動指定線的座標。
   --------------------------------------------------------------------------- */
const initGifAnnotations = (block) => {
  const layer = block.querySelector('[data-line-layer]');
  if (!layer) return;

  const draw = () => {
    layer.innerHTML = '';
    // 小螢幕已改為單欄排列並隱藏連接線，不需要計算。
    if (window.getComputedStyle(layer).display === 'none') return;

    const blockRect = block.getBoundingClientRect();

    block.querySelectorAll('[data-dot]').forEach((dot) => {
      const label = block.querySelector(`[data-label="${dot.getAttribute('data-dot')}"]`);
      if (!label) return;

      const dotRect = dot.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const dotCx = dotRect.left + dotRect.width / 2;
      const dotCy = dotRect.top + dotRect.height / 2;

      // 自動計算的起點（圓點）與終點（卡片邊框上離圓點最近的一點，
      // 通常是卡片底邊，這樣線不會穿過卡片文字）。
      let dx = dotCx - blockRect.left;
      let dy = dotCy - blockRect.top;
      let lx = Math.max(labelRect.left, Math.min(dotCx, labelRect.right)) - blockRect.left;
      let ly = Math.max(labelRect.top, Math.min(dotCy, labelRect.bottom)) - blockRect.top;

      // 手動微調（全部可省略，省略時就是上面的自動結果）。
      // 數值寫在 storymap-cards.css：整組「圓點＋線」的設定寫在圓點的區塊，
      // 卡片端的微調寫在卡片的區塊；兩邊都會被讀取。
      const dotStyle = window.getComputedStyle(dot);
      const labelStyle = window.getComputedStyle(label);
      const num = (name) => {
        const raw = (dotStyle.getPropertyValue(name) || labelStyle.getPropertyValue(name)).trim();
        if (!raw) return null;
        const value = parseFloat(raw);
        return Number.isFinite(value) ? value : null;
      };

      // 註：--mark-x／--mark-y 由 CSS 直接位移圓點，圓點的實際座標已經含在
      // dotRect 裡，所以線的起點會自動跟著一起移動，這裡不必再加一次。

      // --line-from-x／--line-from-y：只移動線的起點，圓點不動
      dx += num('--line-from-x') || 0;
      dy += num('--line-from-y') || 0;
      // --line-to-x／--line-to-y：把線的「終點」（卡片端）平移幾 px
      lx += num('--line-to-x') || 0;
      ly += num('--line-to-y') || 0;

      // --line-angle：直接指定線的角度（度，0 = 向右、90 = 向下）
      // --line-length：直接指定線的長度（px）
      const autoAngle = Math.atan2(ly - dy, lx - dx) * 180 / Math.PI;
      const autoLength = Math.hypot(lx - dx, ly - dy);
      const angle = num('--line-angle');
      const length = num('--line-length');

      const line = document.createElement('span');
      line.className = 'annotation-line';
      line.style.left = `${dx}px`;
      line.style.top = `${dy}px`;
      line.style.width = `${length === null ? autoLength : length}px`;
      line.style.transform = `rotate(${angle === null ? autoAngle : angle}deg)`;
      layer.appendChild(line);
    });
  };

  const img = block.querySelector('img');
  if (img && !img.complete) img.addEventListener('load', draw);
  window.addEventListener('resize', draw);
  if (typeof ResizeObserver === 'function') new ResizeObserver(draw).observe(block);
  draw();
};
document.querySelectorAll('[data-gif-annotate]').forEach(initGifAnnotations);

/* ---------------------------------------------------------------------------
   第三部分互動標籤
   --------------------------------------------------------------------------- */
const initPart3OriginalCharts = () => {
  document.querySelectorAll('[data-part3-chart-toggle]').forEach((button) => {
    const group = button.closest('.part3-chart-frame, .part3-flow-frame');
    if (!group) return;
    button.addEventListener('click', () => {
      group.querySelectorAll('[data-part3-chart-toggle]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });
};
initPart3OriginalCharts();

const initPart3ToolsChecklist = () => {
  document.querySelectorAll('[data-part3-tools-checklist]').forEach((workbench) => {
    const rows = [...workbench.querySelectorAll('[data-part3-tool-id]')];
    const views = [...workbench.querySelectorAll('[data-part3-tool-info]')];
    if (!rows.length || !views.length) return;

    // 手機版／窄螢幕：工具清單隱藏後改用的左右箭頭、頁碼、勾選章
    // （桌面版沒有這些元素時，下面的查詢會拿到 null，直接安全跳過）。
    const mnav = workbench.querySelector('[data-part3-tools-mnav]');
    const mPrev = mnav && mnav.querySelector('[data-part3-tools-nav="prev"]');
    const mNext = mnav && mnav.querySelector('[data-part3-tools-nav="next"]');
    const mCount = mnav && mnav.querySelector('[data-part3-tools-count]');
    const mTick = mnav && mnav.querySelector('[data-part3-tools-tick]');
    let tickTimer = null;

    const selectTool = (id) => {
      const idx = rows.findIndex((item) => item.dataset.part3ToolId === id);
      if (idx === -1) return;
      const row = rows[idx];
      const view = views.find((item) => item.dataset.part3ToolInfo === id);
      if (!view) return;
      rows.forEach((item) => item.classList.toggle('is-active', item === row));
      views.forEach((item) => { item.hidden = item !== view; });

      if (mCount) mCount.textContent = `${idx + 1} / ${rows.length}`;
      if (mPrev) mPrev.disabled = idx === 0;
      if (mNext) mNext.disabled = idx === rows.length - 1;
      if (mTick) {
        // 每次換到新工具都重播一次「空白 → 打勾」的效果，而不是維持已勾狀態
        mTick.classList.remove('is-ticked');
        if (tickTimer) window.clearTimeout(tickTimer);
        // eslint-disable-next-line no-void
        void mTick.offsetWidth;
        tickTimer = window.setTimeout(() => mTick.classList.add('is-ticked'), 220);
      }
    };

    rows.forEach((row) => {
      row.addEventListener('change', () => selectTool(row.dataset.part3ToolId));
      row.addEventListener('click', () => selectTool(row.dataset.part3ToolId));
    });

    if (mPrev) mPrev.addEventListener('click', () => {
      const idx = rows.findIndex((item) => item.classList.contains('is-active'));
      if (idx > 0) selectTool(rows[idx - 1].dataset.part3ToolId);
    });
    if (mNext) mNext.addEventListener('click', () => {
      const idx = rows.findIndex((item) => item.classList.contains('is-active'));
      if (idx < rows.length - 1) selectTool(rows[idx + 1].dataset.part3ToolId);
    });

    selectTool(rows[0].dataset.part3ToolId);
  });
};
initPart3ToolsChecklist();

/* ---------------------------------------------------------------------------
   手機版／窄螢幕：「重用平台的基本流程」8 個步驟排成 2 欄「展開紙盒」版面。
   桌面版維持原本的橫向雪佛龍樣式（見 storymap.css），這裡只負責在手機版
   判斷時機、播放一次掀開動畫。

   時機：以「重用平台的基本流程」標題／說明文字（#part-3-basic-flow-card）
   的位置為準——當它的頂端捲動到「螢幕高度 70%」那條線（畫面最底定義為
   0%、最頂為 100%，所以 70% 高＝距離視窗頂端 30% 的位置）時觸發一次。
   --------------------------------------------------------------------------- */
const initPart3MobileFlowUnfold = () => {
  document.querySelectorAll('.part3-flow-chev').forEach((chev) => {
    const items = [...chev.querySelectorAll('.part3-flow-step')];
    if (!items.length) return;
    const card = document.getElementById('part-3-basic-flow-card') || chev;

    let played = false;
    const play = () => {
      played = true;
      items.forEach((el) => el.classList.remove('is-shown'));
      let t = 100;
      items.forEach((el, idx) => {
        window.setTimeout(() => el.classList.add('is-shown'), t);
        t += 260 + (idx === 3 ? 200 : 0); // 第 4 格之後多停一拍，再開始右欄
      });
    };

    let ticking = false;
    const checkTrigger = () => {
      ticking = false;
      if (played || !PHOTO_GALLERY_MOBILE_MQ.matches) return;
      const triggerLine = window.innerHeight * 0.3; // 螢幕高度 70%（從底部算）＝頂端往下 30%
      if (card.getBoundingClientRect().top <= triggerLine) play();
    };
    const requestCheck = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkTrigger);
    };

    window.addEventListener('scroll', requestCheck, { passive: true });
    window.addEventListener('resize', requestCheck, { passive: true });
    requestCheck(); // 頁面載入時若已經在觸發線之下（例如透過錨點跳入），也要立刻檢查一次
  });
};
initPart3MobileFlowUnfold();

/* ---------------------------------------------------------------------------
   手機版／窄螢幕：讓「重用平台的基本流程」8 個格子維持正方形。
   .part3-flow-chev 本身靠 flex（flex:1 1 auto ＋ 父層 flex column 的預設
   stretch）填滿可用空間，格子大小則交給 grid-template-columns/rows 的
   var(--flow-box-size) 決定，兩個方向用同一個變數＝正方形。這裡量測
   .part3-flow-chev 目前的可用寬高（量測時機不受這個變數影響，因為
   flex 已經把外框撐好了，內部格子多大不影響外框大小），取「寬度可以
   放兩欄」「高度可以放四列」兩者較小的一個，換算成單一格子的邊長。
   --------------------------------------------------------------------------- */
const initPart3MobileFlowSquare = () => {
  const GAP = 6;
  const MIN_SIZE = 56;
  const MAX_SIZE = 190;
  document.querySelectorAll('.part3-flow-chev').forEach((chev) => {
    const resize = () => {
      if (!PHOTO_GALLERY_MOBILE_MQ.matches) {
        chev.style.removeProperty('--flow-box-size');
        return;
      }
      const rect = chev.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const byWidth = (rect.width - GAP) / 2;
      const byHeight = (rect.height - GAP * 3) / 4;
      const size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.floor(Math.min(byWidth, byHeight))));
      chev.style.setProperty('--flow-box-size', `${size}px`);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (typeof ResizeObserver === 'function') new ResizeObserver(resize).observe(chev);
    if (PHOTO_GALLERY_MOBILE_MQ.addEventListener) PHOTO_GALLERY_MOBILE_MQ.addEventListener('change', resize);
    else PHOTO_GALLERY_MOBILE_MQ.addListener(resize);
  });
};
initPart3MobileFlowSquare();

/* ---------------------------------------------------------------------------
   版面特徵探索器（7 辨識印刷字 / 8 辨識手寫字）
   左半是原件：印刷本為書冊翻頁，手寫本為風琴摺（每張掃描分三摺，
   固定兩摺一組展開）。點擊標籤會顯示相應的人工標示圖片，右半同時逐字播出
   「AI 指示 → AI 生成的 Python 代碼 → OCR 的輸出結果」三個視窗。
   內容全部來自 storymap-example.html 的 data-part3-feature-data JSON。
   --------------------------------------------------------------------------- */
const initPart3FeatureExplorers = () => {
  const CHAT_ICONS = `
    <span class="part3-fx-chat-ic">+</span>
    <span class="part3-fx-chat-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1.5 1 4.5 1 6 0"/></svg></span>
    <span class="part3-fx-chat-model"><span class="spin"></span>5.6<span class="chev">▾</span></span>
    <span class="part3-fx-chat-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span>
    <span class="part3-fx-chat-send">↑</span>`;

  const outMarkup = `
    <div class="part3-fx-feat">
      <h3 data-fx-title></h3>
      <p data-fx-desc></p>
    </div>
    <div class="part3-fx-arrow" aria-hidden="true">↓</div>
    <div class="part3-fx-chat">
      <div class="part3-fx-win-bar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">AI Prompt</span></div>
      <div class="part3-fx-chat-body">
        <div class="part3-fx-chat-input">
          <div class="part3-fx-chat-text" data-fx-prompt></div>
          <div class="part3-fx-chat-row">${CHAT_ICONS}</div>
        </div>
      </div>
    </div>
    <div class="part3-fx-arrow" aria-hidden="true">↓</div>
    <div class="part3-fx-win">
      <div class="part3-fx-win-bar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">AI 生成的 Python 代碼</span></div>
      <div class="part3-fx-win-body" data-fx-py></div>
    </div>
    <div class="part3-fx-arrow" aria-hidden="true">↓</div>
    <div class="part3-fx-win">
      <div class="part3-fx-win-bar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">OCR 的輸出結果</span></div>
      <div class="part3-fx-win-body" data-fx-json></div>
    </div>`;

  document.querySelectorAll('[data-part3-explorer]').forEach((root) => {
    const data = parseJsonScript(root);
    const features = (data && data.features) || [];
    if (!features.length) return;

    /* 標籤的顏色與位置走 CSS 變數；7、8 的人工標示都由 JSON 指定的
       annotated PNG 顯示，不再需要 CSS 色塊位置。 */
    const kind = root.dataset.part3Explorer;
    const injectDefaults = () => {
      const rules = features.map((f) => {
        const tag = f.tag || {};
        const decls = [
          `--fx-color: ${f.colour || '#e6e0d4'}`,
          `--fx-tag-left: ${tag.left || 'auto'}`,
          `--fx-tag-right: ${tag.right || 'auto'}`,
          `--fx-tag-top: ${tag.top || 'auto'}`
        ].join('; ');
        return `[data-part3-explorer="${kind}"] [data-fx-feature="${f.key}"] { ${decls}; }`;
      });
      const style = document.createElement('style');
      style.dataset.part3FxDefaults = kind;
      style.textContent = rules.join('\n');
      document.head.appendChild(style);
    };
    injectDefaults();

    const out = root.querySelector('[data-part3-fx-out]');
    out.innerHTML = outMarkup;
    const elTitle = out.querySelector('[data-fx-title]');
    const elDesc = out.querySelector('[data-fx-desc]');
    const elPrompt = out.querySelector('[data-fx-prompt]');
    const elPy = out.querySelector('[data-fx-py]');
    const elJson = out.querySelector('[data-fx-json]');

    const tagHost = root.querySelector('[data-part3-fx-tags]');
    const indEl = root.querySelector('[data-part3-fx-ind]');
    const prevBtn = root.querySelector('[data-part3-fx-prev]');
    const nextBtn = root.querySelector('[data-part3-fx-next]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cur = 0;
    const timers = [];
    const stopTyping = () => { while (timers.length) window.clearTimeout(timers.pop()); };

    // 逐字播出：純文字（AI 指示）與含語法標色的 HTML（代碼／JSON）分開處理。
    const typeText = (host, text, speed, caretClass, perTick) => {
      let i = 0;
      const step = () => {
        i = Math.min(i + perTick, text.length);
        host.textContent = text.slice(0, i);
        if (i < text.length) {
          const caret = document.createElement('span');
          caret.className = caretClass;
          host.appendChild(caret);
          timers.push(window.setTimeout(step, speed));
        }
      };
      step();
    };
    // 含標色標籤的內容：先整段放進 DOM，再把文字節點清空後逐字補回，
    // 這樣顏色標籤不會被切斷（與 revealAgenticLine 相同做法）。
    const typeHtml = (host, html, speed, perTick) => {
      host.innerHTML = html;
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) { nodes.push({ node, full: node.textContent }); node.textContent = ''; }
      if (!nodes.length) return;
      let ni = 0;
      const step = () => {
        let budget = perTick;
        while (budget > 0 && ni < nodes.length) {
          const entry = nodes[ni];
          const shown = entry.node.textContent.length;
          if (shown >= entry.full.length) { ni += 1; continue; }
          const take = Math.min(budget, entry.full.length - shown);
          entry.node.textContent = entry.full.slice(0, shown + take);
          budget -= take;
        }
        if (ni < nodes.length) timers.push(window.setTimeout(step, speed));
      };
      step();
    };

    /* 「AI 生成的 Python 代碼」「OCR 的輸出結果」內容長短不一：
       依純文字長度（去掉標色用的 <span> 標籤）分級調整字級，
       盡量讓內容一次顯示更多，放不下的部分再交給視窗自己的捲動。
       字級只有這幾個級距，不是每個字元都重新計算，畫面才不會抖動。 */
    const fitCodeFont = (el, html) => {
      const plain = (html || '').replace(/<[^>]+>/g, '');
      const len = plain.length;
      let px = 13;
      if (len > 720) px = 10.5;
      else if (len > 480) px = 11.5;
      else if (len > 300) px = 12.5;
      el.style.setProperty('--fx-code-font-size', px + 'px');
    };

    const showFeature = (index) => {
      const f = features[index];
      if (!f) return;
      cur = index;
      syncToCurrent();
      render();
      stopTyping();
      elTitle.textContent = f.title;
      elDesc.textContent = f.desc;
      fitCodeFont(elPy, f.py);
      fitCodeFont(elJson, f.json);
      if (reduceMotion) {
        elPrompt.textContent = f.prompt;
        elPy.innerHTML = f.py;
        elJson.innerHTML = f.json;
        return;
      }
      elPrompt.textContent = '';
      elPy.innerHTML = '';
      elJson.innerHTML = '';
      // 三個視窗同時開始，速度較快
      typeText(elPrompt, f.prompt, 18, 'part3-fx-caret part3-fx-caret-chat', 2);
      typeHtml(elPy, f.py, 14, 4);
      typeHtml(elJson, f.json, 14, 4);
    };

    const buildTags = (isOnScreen, positioned) => {
      tagHost.innerHTML = '';
      features.forEach((f, i) => {
        const tag = document.createElement('button');
        tag.type = 'button';
        const other = !isOnScreen(f);
        tag.className = 'part3-fx-tag'
          + (i === cur ? ' is-active' : ' is-dim')
          + (other ? ' is-other' : '');
        // 標籤位置與顏色仍交由 CSS 變數決定；人工標示圖片由 f.image 提供。
        tag.dataset.fxFeature = f.key;
        if (positioned) tag.classList.add('is-floating');
        const label = f.title.split('：')[0].split('（')[0];
        tag.innerHTML = label;
        tag.addEventListener('click', () => showFeature(i));
        tagHost.appendChild(tag);
      });
    };

    let render = () => {};
    let syncToCurrent = () => {};

    /* ---------- 7 印刷字：書冊翻頁 ---------- */
    if (root.dataset.part3Explorer === 'printed') {
      const pages = data.pages || [];
      const img = root.querySelector('[data-part3-fx-img]');
      const pageEl = img.parentElement;
      let page = 0;
      let turning = false;
      features.forEach((f) => { f.badge = `p.${(f.page || 0) + 1}`; });

      const openPrintedGallery = (triggerEl) => {
        const feature = features[cur];
        const galleryPages = pages.map((src, i) => {
          const annotated = feature && (feature.page || 0) === i && feature.image;
          return {
            src: annotated ? feature.image : src,
            alt: annotated ? `${feature.title}：人工標示頁面` : `印刷本奏摺第 ${i + 1} 頁`,
            title: annotated ? feature.title : `印刷本奏摺第 ${i + 1} 頁`,
            description: annotated
              ? feature.desc
              : '《明清臺灣檔案彙編》的印刷本奏摺頁面，可使用左右按鈕查看前後頁。'
          };
        });
        photoLightbox.openGallery(galleryPages, page, {
          title: '辨識印刷字', captionTitle: '', showPageNumber: false
        }, triggerEl);
      };
      img.title = '點擊放大檢視';
      img.addEventListener('click', () => openPrintedGallery(img));

      const paintPage = () => {
        const f = features[cur];
        const selectedImage = f && (f.page || 0) === page && f.image ? f.image : pages[page];
        img.src = selectedImage;
        /* 讓 storymap-cards.css 可以針對「目前顯示的是哪一張圖」個別調整
           手機版抽屜裡的位置與放大倍數，例如
           [data-fx-visual="辨識印刷字Label/文本資訊.png"] { --fxdoc-scale: 1.6; } */
        img.dataset.fxVisual = selectedImage;
        img.alt = f && (f.page || 0) === page && f.image ? `${f.title}：人工標示頁面` : '印刷本奏摺頁面';
        indEl.textContent = `頁 ${page + 1} / ${pages.length}`;

        prevBtn.disabled = page === 0;
        nextBtn.disabled = page === pages.length - 1;
        buildTags((f) => (f.page || 0) === page, true);
      };
      render = paintPage;

      // 翻頁：新的一頁自右滑入疊在舊頁之上，像翻動檔案夾裡的紙張。
      const turnTo = (next, dir) => {
        if (turning || next === page || next < 0 || next >= pages.length) return;
        if (reduceMotion) { page = next; paintPage(); return; }
        turning = true;
        const sheet = document.createElement('div');
        sheet.className = 'part3-fx-turn';
        const sImg = document.createElement('img');
        sheet.appendChild(sImg);
        if (dir > 0) {
          sImg.src = pages[next];
          sheet.style.transform = 'translateX(102%)';
          pageEl.appendChild(sheet);
          window.requestAnimationFrame(() => {
            sheet.style.transition = 'transform .5s cubic-bezier(.33,.9,.3,1)';
            sheet.style.transform = 'translateX(0)';
          });
        } else {
          sImg.src = pages[page];
          sheet.style.transform = 'translateX(0)';
          pageEl.appendChild(sheet);
          img.src = pages[next];
          window.requestAnimationFrame(() => {
            sheet.style.transition = 'transform .5s cubic-bezier(.33,.9,.3,1)';
            sheet.style.transform = 'translateX(102%)';
          });
        }
        window.setTimeout(() => { page = next; sheet.remove(); turning = false; paintPage(); }, 520);
      };
      prevBtn.addEventListener('click', () => turnTo(page - 1, -1));
      nextBtn.addEventListener('click', () => turnTo(page + 1, 1));
      // 選到其他頁的特徵時，先翻到該頁，翻頁動畫結束後再顯示人工標示圖片
      render = () => {
        const f = features[cur];
        const target = f ? (f.page || 0) : page;
        if (target !== page && !turning) { turnTo(target, target > page ? 1 : -1); return; }
        paintPage();
      };
      paintPage();
    }

    /* ---------- 8 手寫字：風琴摺 ---------- */
    if (root.dataset.part3Explorer === 'folded') {
      const strip = root.querySelector('[data-part3-fx-strip]');
      const sheets = data.sheets || [];
      const panels = [];
      sheets.forEach((src) => { [2, 1, 0].forEach((part) => panels.push({ src, part })); });
      const pairCount = Math.ceil(panels.length / 2);
      const pairOf = (i) => Math.floor(i / 2);
      let pair = 0;
      features.forEach((f) => { f.badge = `第 ${(f.panel || 0) + 1} 摺`; });

      const openHandwrittenGallery = (sheetIndex, triggerEl) => {
        const feature = features[cur];
        const selectedSheet = feature && feature.image ? Math.floor((feature.panel || 0) / 3) : -1;
        const galleryPages = sheets.map((src, i) => {
          const annotated = i === selectedSheet;
          return {
            src: annotated ? feature.image : src,
            alt: annotated ? `${feature.title}：人工標示頁面` : `手寫奏摺第 ${i + 1} 張掃描頁面`,
            title: annotated ? feature.title : `手寫奏摺第 ${i + 1} 張掃描頁面`,
            description: annotated
              ? feature.desc
              : '手寫奏摺原件掃描頁面，可使用左右按鈕查看前後頁。'
          };
        });
        photoLightbox.openGallery(galleryPages, sheetIndex, {
          title: '辨識手寫字', captionTitle: '', showPageNumber: false
        }, triggerEl);
      };

      panels.forEach((p, i) => {
        const el = document.createElement('div');
        el.className = 'part3-fx-panel';
        el.dataset.sheetIndex = String(Math.floor(i / 3));
        el.style.setProperty('--posx', `${p.part * 50}%`);
        if (data.foldAspect) el.style.setProperty('--fold-aspect', data.foldAspect);
        el.title = '點擊放大檢視整張奏摺頁面';
        el.addEventListener('click', () => {
          pair = pairOf(i);
          render();
          openHandwrittenGallery(Math.floor(i / 3), el);
        });
        strip.appendChild(el);
      });

      // 只有「選取特徵」時才跳到該摺所在的組；上一組／下一組按鈕自行翻頁，
      // 不可在 render() 內重設 pair，否則按鈕會被立刻覆蓋回原位。
      syncToCurrent = () => {
        const f = features[cur];
        if (f) pair = pairOf(f.panel || 0);
      };
      render = () => {
        const f = features[cur];
        const start = pair * 2;
        [...strip.children].forEach((el, i) => {
          const open = i === start || i === start + 1;
          el.classList.toggle('is-open', open);
          const selectedSheet = f && f.image ? Math.floor((f.panel || 0) / 3) : -1;
          const image = selectedSheet === Number(el.dataset.sheetIndex)
            ? f.image
            : sheets[Number(el.dataset.sheetIndex)];
          el.style.setProperty('--src', `url("${image}")`);
        });
        indEl.textContent = `頁 ${pair + 1} / ${pairCount}`;
        prevBtn.disabled = pair === 0;
        nextBtn.disabled = pair >= pairCount - 1;
        buildTags((ft) => pairOf(ft.panel || 0) === pair, true);
      };

      prevBtn.addEventListener('click', () => { if (pair > 0) { pair -= 1; render(); } });
      nextBtn.addEventListener('click', () => { if (pair < pairCount - 1) { pair += 1; render(); } });

      // 摺子寬度依可用寬度換算，確保展開的兩摺完整顯示且不變形
      const sizeStrip = () => {
        const pane = strip.parentElement;
        const cs = window.getComputedStyle(pane);
        const avail = pane.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        strip.style.setProperty('--fold-w', `${Math.max(avail, 240)}px`);
      };
      sizeStrip();
      window.addEventListener('resize', sizeStrip);
      if (typeof ResizeObserver === 'function') new ResizeObserver(sizeStrip).observe(strip.parentElement);
    }

    showFeature(0);
  });
};
// 呼叫寫在 parseJsonScript 定義之後（見 initAgenticScene 下方），避免 TDZ 錯誤。

const initPart3FlowNavigation = () => {
  document.querySelectorAll('[data-part3-flow-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.part3FlowTarget;
      if (target) setActiveTab('part-3', { scrollTarget: target });
    });
  });
};
initPart3FlowNavigation();

/* ---------------------------------------------------------------------------
   Agentic AI 動畫場景：四個實際專案工作視窗逐字「打出來」再整段清空重播。
   每個視窗的內容（含語法標色用的 <span>）寫在 storymap-example.html 裡
   對應的 <script type="application/json"> 區塊，這裡只負責播放。
   --------------------------------------------------------------------------- */
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

// 把一行（可能包含 <span class="..."> 這類語法標色標籤）逐字顯示出來。
// 做法：先把整行內容放進 DOM（標籤結構都在），再把每個文字節點清空，
// 之後照文件順序一個字一個字補回去，這樣顏色標籤不會被字元切斷。
const revealAgenticLine = (host, html, charDelay) => new Promise((resolve) => {
  const lineEl = document.createElement('span');
  lineEl.className = 'line';
  lineEl.innerHTML = html;
  host.appendChild(lineEl);
  host.scrollTop = host.scrollHeight;

  const walker = document.createTreeWalker(lineEl, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current;
  while ((current = walker.nextNode())) {
    textNodes.push({ node: current, full: current.textContent });
    current.textContent = '';
  }
  if (!textNodes.length) { resolve(); return; }

  let nodeIndex = 0;
  let charIndex = 0;
  const typeNextChar = () => {
    if (nodeIndex >= textNodes.length) { resolve(); return; }
    const entry = textNodes[nodeIndex];
    if (charIndex >= entry.full.length) { nodeIndex += 1; charIndex = 0; typeNextChar(); return; }
    entry.node.textContent += entry.full[charIndex];
    charIndex += 1;
    // 內容比顯示區長時，跟著游標往下捲動，讓正在打的那一行保持可見。
    host.scrollTop = host.scrollHeight;
    window.setTimeout(typeNextChar, charDelay);
  };
  typeNextChar();
});

// 播放一組行：逐行打出來、停留一段時間（含閃爍游標），再清空重新開始。
// 回傳一個「停止」函式，畫面離開可視範圍時呼叫它暫停，不必真的移除內容。
const typeAgenticSequence = (host, lines, { charDelay = 26, lineDelay = 450, holdTime = 2600, clearDelay = 500 } = {}) => {
  let cancelled = false;

  const run = async () => {
    while (!cancelled) {
      host.innerHTML = '';
      for (let i = 0; i < lines.length; i += 1) {
        if (cancelled) return;
        await revealAgenticLine(host, lines[i], charDelay);
        if (cancelled) return;
        if (i < lines.length - 1) await wait(lineDelay);
      }
      if (cancelled) return;
      const caret = document.createElement('span');
      caret.className = 'agentic-caret';
      host.appendChild(caret);
      await wait(holdTime);
      if (cancelled) return;
      caret.remove();
      await wait(clearDelay);
    }
  };
  run();

  return () => { cancelled = true; };
};

// 讀取一個元素內第一個 <script type="application/json"> 的內容並解析成陣列。
// Agentic AI 與 OCR 兩組動畫的文字／頁面清單都用這個共用小工具讀取。
const parseJsonScript = (host) => {
  const script = host.querySelector('script[type="application/json"]');
  if (!script) return [];
  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    return [];
  }
};

const initAgenticScene = () => {
  document.querySelectorAll('[data-agentic-scene]').forEach((scene) => {
    const sequences = [...scene.querySelectorAll('[data-agentic-sequence]')]
      .map((host) => ({ host, lines: parseJsonScript(host) }))
      .filter((item) => item.lines.length);
    if (!sequences.length) return;

    // 使用者要求減少動態效果時，直接顯示完整內容，不逐字播放。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const renderStatic = (host, lines) => {
        host.innerHTML = lines.map((line) => `<span class="line">${line}</span>`).join('');
      };
      sequences.forEach(({ host, lines }) => renderStatic(host, lines));
      return;
    }

    let stops = [];
    const start = () => {
      if (stops.length) return;
      stops = sequences.map(({ host, lines }) => typeAgenticSequence(host, lines, {
        charDelay: Number(host.dataset.agenticCharDelay) || 26,
        lineDelay: Number(host.dataset.agenticLineDelay) || 420,
        holdTime: Number(host.dataset.agenticHoldTime) || 2600,
        clearDelay: Number(host.dataset.agenticClearDelay) || 500
      }));
    };
    const stop = () => {
      stops.forEach((cancel) => cancel());
      stops = [];
    };

    // 畫面不在可視範圍（包含被 checklist 切到 hidden）時暫停播放，省資源。
    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => { entry.isIntersecting ? start() : stop(); });
      }, { threshold: .1 }).observe(scene);
    } else {
      start();
    }
  });
};
initAgenticScene();

// 版面特徵探索器：函式定義在上方，但要等 parseJsonScript 宣告後才能執行。
initPart3FeatureExplorers();

// Codex 視窗分成兩個階段：先逐步顯示工作／思考過程，完成後隱藏該過程，
// 只保留安裝結果。離開可視範圍時取消本次播放，重新進入時從頭開始。
const renderAgenticLines = (host, lines) => {
  host.innerHTML = lines.map((line) => `<span class="line">${line}</span>`).join('');
};

const typeAgenticCodexPhases = (thinkingPhase, thinkingHost, resultPhase, resultHost, thinkingLines, resultLines, options = {}) => {
  let cancelled = false;
  const charDelay = Number(options.charDelay) || 12;
  const lineDelay = Number(options.lineDelay) || 320;

  const run = async () => {
    thinkingPhase.hidden = false;
    resultPhase.hidden = true;
    thinkingHost.innerHTML = '';
    resultHost.innerHTML = '';
    for (let i = 0; i < thinkingLines.length; i += 1) {
      if (cancelled) return;
      await revealAgenticLine(thinkingHost, thinkingLines[i], charDelay);
      if (cancelled) return;
      if (i < thinkingLines.length - 1) await wait(lineDelay);
    }
    if (cancelled) return;
    await wait(520);
    if (cancelled) return;
    thinkingPhase.hidden = true;
    resultPhase.hidden = false;
    renderAgenticLines(resultHost, resultLines);
  };
  run();

  return () => { cancelled = true; };
};

const initAgenticCodexPhases = () => {
  document.querySelectorAll('[data-agentic-codex-phases]').forEach((body) => {
    const scene = body.closest('[data-agentic-scene]');
    const thinkingPhase = body.querySelector('[data-agentic-codex-thinking]');
    const thinkingHost = body.querySelector('[data-agentic-codex-thinking-sequence]');
    const resultPhase = body.querySelector('[data-agentic-codex-result]');
    const resultHost = body.querySelector('[data-agentic-codex-result-lines]');
    if (!scene || !thinkingPhase || !thinkingHost || !resultPhase || !resultHost) return;
    const thinkingLines = parseJsonScript(thinkingHost);
    const resultLines = parseJsonScript(resultHost);
    if (!thinkingLines.length || !resultLines.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      thinkingPhase.hidden = true;
      resultPhase.hidden = false;
      renderAgenticLines(resultHost, resultLines);
      return;
    }

    let cancel = null;
    const start = () => {
      if (cancel) return;
      cancel = typeAgenticCodexPhases(thinkingPhase, thinkingHost, resultPhase, resultHost, thinkingLines, resultLines, {
        charDelay: thinkingHost.dataset.agenticCodexCharDelay,
        lineDelay: thinkingHost.dataset.agenticCodexLineDelay
      });
    };
    const stop = () => {
      if (!cancel) return;
      cancel();
      cancel = null;
    };

    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => { entry.isIntersecting ? start() : stop(); });
      }, { threshold: .1 }).observe(scene);
    } else {
      start();
    }
  });
};
initAgenticCodexPhases();

// 運用 Agentic AI 使用 PaddleOCR：Codex 對話視窗與 PaddleOCR Python 視窗重疊排列，
// 點擊任一視窗即可把該視窗切換到最上層。
const initPart3AgenticOcrWindows = () => {
  document.querySelectorAll('[data-agentic-window]').forEach((windowEl) => {
    windowEl.addEventListener('click', () => {
      const scene = windowEl.closest('.agentic-scene-paddleocr');
      if (!scene) return;
      const target = windowEl.dataset.agenticWindow;
      scene.querySelectorAll('[data-agentic-window]').forEach((win) => {
        win.style.zIndex = win.dataset.agenticWindow === target ? 3 : 2;
        win.classList.toggle('is-agentic-front', win.dataset.agenticWindow === target);
      });
    });
  });
};
initPart3AgenticOcrWindows();

/* ---------------------------------------------------------------------------
   OCR 掃描動畫（「甚麼是 OCR？」）：兩份文書的頁面各自循環切換，
   下方 JSON 輸出區沿用 Agentic AI 動畫同一套逐字打字技巧（typeAgenticSequence）。
   --------------------------------------------------------------------------- */

// 把一張圖片換成下一頁：先淡出移到左邊，換圖後瞬間跳到右邊（不轉場），
// 再讓轉場動畫把它帶回中間，畫面上就是「從右邊翻頁進來」的效果。
const cycleOcrPage = (img, pages, { interval = 3400, turnMs = 420 } = {}) => {
  if (pages.length < 2) return () => {};
  let index = 0;
  let stopped = false;
  const timer = window.setInterval(() => {
    if (stopped) return;
    img.classList.add('is-turning');
    window.setTimeout(() => {
      if (stopped) return;
      index = (index + 1) % pages.length;
      img.src = pages[index];
      img.classList.add('is-jumping');
      void img.offsetWidth; // 強制 reflow，讓「跳到右側」不被轉場動畫拖慢
      img.classList.remove('is-jumping');
      img.classList.remove('is-turning');
    }, turnMs);
  }, interval);
  return () => { stopped = true; window.clearInterval(timer); };
};

const initOcrScanScene = () => {
  document.querySelectorAll('[data-ocr-scene]').forEach((scene) => {
    const pageImgs = [...scene.querySelectorAll('[data-ocr-page-img]')];
    const outputHost = scene.querySelector('[data-ocr-output]');
    if (!pageImgs.length || !outputHost) return;

    const pageSets = pageImgs.map((img) => {
      const script = img.parentElement.querySelector('script[data-ocr-pages]');
      if (!script) return [];
      try {
        return JSON.parse(script.textContent);
      } catch (error) {
        return [];
      }
    });

    const outputLines = parseJsonScript(outputHost);
    if (!outputLines.length) return;

    // 使用者要求減少動態效果時，只顯示第一頁與完整 JSON，不逐字播放。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      outputHost.innerHTML = outputLines.map((line) => `<span class="line">${line}</span>`).join('');
      return;
    }

    let stopPages = [];
    let stopOutput = null;
    const start = () => {
      if (stopPages.length || stopOutput) return;
      // 兩份文書的翻頁間隔稍微錯開，避免同時翻頁顯得太整齊、不自然。
      stopPages = pageImgs.map((img, i) => cycleOcrPage(img, pageSets[i], { interval: 3200 + i * 700 }));
      // body 欄位是全文，字數較多，打字間隔調快一點，避免跑完一輪要等太久。
      stopOutput = typeAgenticSequence(outputHost, outputLines, { charDelay: 9, lineDelay: 220, holdTime: 3600, clearDelay: 500 });
    };
    const stop = () => {
      stopPages.forEach((fn) => fn());
      stopOutput?.();
      stopPages = [];
      stopOutput = null;
    };

    // 畫面不在可視範圍時暫停播放，省資源。
    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => { entry.isIntersecting ? start() : stop(); });
      }, { threshold: .1 }).observe(scene);
    } else {
      start();
    }
  });
};
initOcrScanScene();

/* 9. 輸出格式：JSON — 標籤點擊捲動＋持續反白，段落二展開／收合。
   純互動，沒有動畫迴圈，不需要 IntersectionObserver。 */
const initJsonViewer = () => {
  const wrap = document.querySelector('.part3-json-viewer-wrap');
  if (!wrap) return;

  let selectedButton = null;
  let selectedTargets = [];
  const labelViewport = wrap.querySelector('.part3-json-label-viewport');
  const jsonBody = wrap.querySelector('.part3-json-body');
  const labelButtons = [...wrap.querySelectorAll('[data-json-target]')];
  const previousButton = wrap.querySelector('[data-json-nav="prev"]');
  const nextButton = wrap.querySelector('[data-json-nav="next"]');
  let carouselIndex = 0;

  const updateCarouselButtons = () => {
    const canScroll = labelViewport && labelViewport.scrollWidth > labelViewport.clientWidth + 1;
    if (previousButton) previousButton.disabled = !canScroll || carouselIndex <= 0;
    if (nextButton) nextButton.disabled = !canScroll || carouselIndex >= labelButtons.length - 1;
  };

  const showCarouselLabel = (index) => {
    if (!labelButtons.length) return;
    carouselIndex = Math.max(0, Math.min(labelButtons.length - 1, index));
    const button = labelButtons[carouselIndex];
    if (labelViewport && button) {
      const left = button.offsetLeft - (labelViewport.clientWidth - button.offsetWidth) / 2;
      labelViewport.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
    updateCarouselButtons();
  };

  const scrollJsonTargetIntoView = (target) => {
    if (!jsonBody || !target) return;
    const bodyRect = jsonBody.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = jsonBody.scrollTop + targetRect.top - bodyRect.top;
    const targetCenter = targetTop + targetRect.height / 2;
    const centeredTop = targetCenter - jsonBody.clientHeight / 2;
    const maxScrollTop = Math.max(0, jsonBody.scrollHeight - jsonBody.clientHeight);
    jsonBody.scrollTo({
      top: Math.max(0, Math.min(maxScrollTop, centeredTop)),
      behavior: 'smooth'
    });
  };

  labelButtons.forEach((button, index) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const ids = button.dataset.jsonTarget.split(/\s+/);
      const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
      if (!targets.length) return;

      if (selectedButton) {
        selectedButton.classList.remove('is-selected');
        selectedButton.setAttribute('aria-pressed', 'false');
      }
      selectedTargets.forEach((el) => el.classList.remove('is-selected'));

      showCarouselLabel(index);
      scrollJsonTargetIntoView(targets[0]);
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      targets.forEach((el) => el.classList.add('is-selected'));
      selectedButton = button;
      selectedTargets = targets;
    });
  });

  previousButton?.addEventListener('click', () => {
    carouselIndex = 0;
    if (labelViewport) labelViewport.scrollTo({ left: 0, behavior: 'smooth' });
    updateCarouselButtons();
  });
  nextButton?.addEventListener('click', () => {
    carouselIndex = Math.max(0, labelButtons.length - 1);
    if (labelViewport) {
      labelViewport.scrollTo({ left: labelViewport.scrollWidth, behavior: 'smooth' });
    }
    updateCarouselButtons();
  });
  const refreshCarouselState = () => {
    updateCarouselButtons();
    window.requestAnimationFrame(updateCarouselButtons);
  };
  window.addEventListener('resize', refreshCarouselState);
  window.addEventListener('load', refreshCarouselState);
  if (labelViewport && 'ResizeObserver' in window) {
    const carouselObserver = new ResizeObserver(refreshCarouselState);
    carouselObserver.observe(labelViewport);
  }
  refreshCarouselState();

  /* 一個按鈕，兩種功能：收起來時顯示「...」（點擊＝展開），
     展開時顯示向上的「⌃」（點擊＝收起來）。按鈕放在完整段落之後，
     因此展開時會自然移到「等情前來。」之後。 */
  wrap.querySelectorAll('.para-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rest = wrap.querySelector(`[data-para-rest="${btn.dataset.paraToggle}"]`);
      if (!rest) return;
      const isHidden = rest.hidden;
      rest.hidden = !isHidden;
      const expanded = isHidden;
      btn.textContent = expanded ? '⌃' : '...';
      btn.setAttribute('aria-label', expanded ? '收合' : '展開');
      btn.setAttribute('title', expanded ? '收合' : '展開');
    });
  });
};
initJsonViewer();

/* 10. OCR測試 — 批次掃描／驗證動畫。
   先單頁測試（1頁），再變成 2×2 持續往下捲的批次處理（50頁）。
   四份文書的內容逐字取自 review-tools/shared data/stage1_original_text.json。
   時間快慢在這裡調整；大小、顏色在 storymap-cards.css 的
   #part-3-test .batch-scene 區塊。 */
const initBatchTestScene = () => {
  const scene = document.querySelector('[data-batch-scene]');
  const track = scene && scene.querySelector('[data-batch-track]');
  if (!scene || !track) return;

  const DOCS = [
    {
      pageLg: 'ocr-anim-1-lg.jpg', pageSm: 'ocr-anim-1-sm.jpg',
      json: {
        doc_id: '硃25', doc_type: '硃批',
        title: '為奏彰化失陷已調兵赴臺事',
        official_post: '福建水師提督', author: '黃仕簡',
        send_date: '乾隆五十一年十二月十日',
        rescript_text: '已有旨了。欽此。',
        body: '福建水師提督一等海澄公奴才黃仕簡謹奏，為奏聞事。竊照臺灣近來屢有匪徒滋事，奴才時刻留心察查，不敢稍有懈忽。'
      }
    },
    {
      pageLg: 'ocr-anim-2-lg.jpg', pageSm: 'ocr-anim-2-sm.jpg',
      json: {
        doc_id: '奏2', doc_type: '上奏',
        title: '為奏林爽文結黨失陷彰城事',
        official_post: '福建陸路提督', author: '任承恩',
        send_date: '乾隆五十一年十二月十日',
        rescript_text: '已有旨了。',
        body: '福建陸路提督革職留任奴才任承恩跪奏，為奏聞事。本年十二月初九日亥刻，奴才接據署臺灣府淡水同知程峻、竹塹營守備董得魁會銜差役楊添投稟報稱。'
      }
    },
    {
      pageLg: 'ocr-anim-3-lg.jpg', pageSm: 'ocr-anim-3-sm.jpg',
      json: {
        doc_id: '奏5', doc_type: '上奏',
        title: '為奏辦理赴剿臺灣匪徒事',
        official_post: '福建水師提督', author: '黃仕簡',
        send_date: '乾隆五十一年十二月十日',
        rescript_text: '已有旨了。',
        body: '茲本年十二月初五日戌刻，訪聞得臺灣彰化縣屬又有匪徒聚集會黨，於十一月二十九日辰刻攻打彰化縣城，至午刻縣城被陷，文武官員不知生死之事。'
      }
    },
    {
      pageLg: 'ocr-anim-4-lg.jpg', pageSm: 'ocr-anim-4-sm.jpg',
      json: {
        doc_id: '台1', doc_type: '其他',
        title: '天地會林爽文起事告示',
        official_post: null, author: '林爽文',
        send_date: null,
        rescript_text: null,
        body: '順天盟主林，為祝天瀝示，以安民心，以保農業事。照得居官愛民如子，才稱為民父母也。今據臺灣皆貪官污吏，擾害生靈，本帥不忍不誅，以救吾民。'
      }
    }
  ];

  const renderJson = (obj) => {
    const rows = Object.entries(obj).map(([k, v]) => {
      const val = v === null ? '<span class="key">null</span>' : `<span class="str">"${v}"</span>`;
      return `&nbsp;&nbsp;<span class="key">"${k}"</span>: ${val},`;
    });
    return ['{', ...rows, '}'].join('<br>');
  };

  /* 兩種尺寸的頁面影像：單頁階段那一頁很大，用 lg（約 1290×940）；
     2×2 批次階段每格只有一百多 px 寬，用 sm（約 495×360）就綽綽有餘。
     這樣批次階段要點陣化的像素量大幅下降，畫面才不會卡。 */
  const makeTile = (doc, countLabel, { big = false } = {}) => {
    const src = big ? doc.pageLg : doc.pageSm;
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
      <div class="tile-page">
        <img class="page-dim" src="${src}" alt="" decoding="async" fetchpriority="low">
        <img class="page-full" src="${src}" alt="" decoding="async" fetchpriority="low">
        <span class="tile-scanline"></span>
      </div>
      <div class="tile-json">
        <div class="tile-json-bar"><span class="tile-json-dot r"></span><span class="tile-json-dot y"></span><span class="tile-json-dot g"></span></div>
        <div class="tile-json-body">${renderJson(doc.json)}<span class="tile-readbeam"></span></div>
      </div>
      <div class="tile-glasses">
        <span class="tile-glasses-shape"></span>
        <span class="tile-lens l"></span>
        <span class="tile-lens r"></span>
      </div>
      <div class="tile-tick"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"></circle><path d="M15 24.5 L21.5 31 L33 19"></path></svg></div>
      <div class="tile-count">${countLabel}</div>`;
    return tile;
  };

  const reset = (tile) => {
    tile.classList.remove('is-scanning', 'is-scanned', 'is-json', 'is-reading', 'is-verified', 'is-active');
    const badge = tile.querySelector('.tile-count');
    if (badge) badge.classList.remove('is-bump');
  };

  /* 一格的完整流程：掃描 → 上色 → 翻成 JSON → 閱讀 → 綠勾。
     綠勾出現的同一刻，頁數標示也放大變藍，跟 1頁→50頁 那次轉換同一個效果。 */
  const runTile = async (tile, { scanDur = 1500, readDur = 1600 } = {}) => {
    reset(tile);
    tile.style.setProperty('--scan-dur', `${scanDur}ms`);
    tile.style.setProperty('--read-dur', `${readDur}ms`);
    tile.classList.add('is-active');
    await wait(120);
    tile.classList.add('is-scanning');
    await wait(scanDur);
    tile.classList.add('is-scanned');
    await wait(340);
    tile.classList.add('is-json');
    await wait(520);
    tile.classList.add('is-reading');
    await wait(readDur);
    tile.classList.add('is-verified');
    const badge = tile.querySelector('.tile-count');
    if (badge) badge.classList.add('is-bump');
    await wait(900);
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 每一次啟動拿一個新編號；捲出畫面時編號 +1，舊流程發現自己過期就結束，
     避免捲進捲出後有兩個流程同時操作同一個 track。 */
  let runId = 0;
  let running = false;

  const runLoop = async (id) => {
    const cancelled = () => id !== runId;
    while (!cancelled()) {
      /* ---- 第一階段：單頁測試 1頁（回到開頭時也用同樣的轉場淡入） ---- */
      scene.classList.add('is-switching-out');
      await wait(420);
      scene.classList.remove('is-batch');
      track.style.removeProperty('--scroll-speed');
      track.innerHTML = '';
      const single = makeTile(DOCS[0], '1頁', { big: true });
      track.appendChild(single);
      await wait(30);
      scene.classList.remove('is-switching-out');
      await wait(480);
      if (cancelled()) return;
      await runTile(single, { scanDur: 1700, readDur: 1900 });
      if (cancelled()) return;

      /* 徽章從 1頁 跳成 50頁 */
      const badge = single.querySelector('.tile-count');
      badge.classList.add('is-bump');
      badge.textContent = '50頁';
      await wait(700);

      /* ---- 轉場：單頁縮小淡出 ---- */
      scene.classList.add('is-switching-out');
      await wait(520);
      if (cancelled()) return;

      /* ---- 第二階段：批次 50頁，2×2 並持續往下捲 ---- */
      track.innerHTML = '';
      const tiles = [];
      /* 做 2 欄 × 8 列＝16 格；捲動 -50% 時剛好接回開頭，看起來是無限往下 */
      for (let i = 0; i < 16; i += 1) {
        const t = makeTile(DOCS[i % DOCS.length], '50頁');
        track.appendChild(t);
        tiles.push(t);
      }
      /* 切換成 2×2 版面，先放大隱藏，再淡入還原 */
      scene.classList.remove('is-switching-out');
      scene.classList.add('is-batch', 'is-switching-in');
      track.style.setProperty('--scroll-speed', '22s');
      await wait(30);
      scene.classList.remove('is-switching-in');
      await wait(480);
      if (cancelled()) return;

      tiles.forEach((t, i) => {
        window.setTimeout(() => {
          if (!cancelled()) runTile(t, { scanDur: 2200, readDur: 1500 });
        }, i * 620);
      });

      await wait(16 * 620 + 6200);
      if (cancelled()) return;
      await wait(600);
    }
  };

  /* 靜態版本：不動畫，直接顯示第一頁掃描完成後的 JSON 與綠勾 */
  if (reduceMotion) {
    const still = makeTile(DOCS[0], '1頁', { big: true });
    still.classList.add('is-scanned', 'is-json', 'is-verified');
    track.appendChild(still);
    return;
  }

  /* 進入畫面才開始跑，捲出畫面就停下來並暫停 CSS 動畫 */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scene.classList.remove('is-paused');
        if (running) return;
        running = true;
        runLoop(runId);
      } else {
        scene.classList.add('is-paused');
        if (!running) return;
        running = false;
        runId += 1;
      }
    });
  }, { threshold: .2 });
  observer.observe(scene);
};
initBatchTestScene();

/* 自己的 GitHub Repository — 雲端上傳動畫（#part-3-tools-card 的
   「備份、管理與協作」資訊面板）。真實檔名持續從底部往上飄向雲朵，代表
   把程式碼、AI Skills、結構化 JSON 備份到 GitHub。大小顏色在
   storymap-cards.css 的 #part-3-tools-card .cloud-scene 調整。 */
const initCloudUploadScene = () => {
  const scene = document.querySelector('[data-cloud-scene]');
  const lane = scene && scene.querySelector('[data-upload-lane]');
  if (!scene || !lane) return;

  /* 真實檔名，互不重複：Skill 取自 tool/skills md/，程式碼取自
     tool/scripts py/，JSON 檔名對應四份已核實的不同文書
     （硃25／奏5／台1／奏2），來源與「9. 輸出格式：JSON」一致。 */
  const ITEMS = [
    { kind: 'skill', name: 'extract-emperor-action.md' },
    { kind: 'skill', name: 'extract-zhupi.md' },
    { kind: 'skill', name: 'chinese-reign-date-conversion.md' },
    { kind: 'skill', name: 'divide-into-parts.md' },
    { kind: 'skill', name: 'merge-emperor-actions.md' },
    { kind: 'skill', name: 'historical-gis.md' },
    { kind: 'code', name: 'ocr_pdf_paragraphs.py' },
    { kind: 'code', name: 'build_stage1_timeline_html.py' },
    { kind: 'code', name: 'merge_pairs.py' },
    { kind: 'code', name: 'clean_vertex_entities.py' },
    { kind: 'json', name: '硃25.json' },
    { kind: 'json', name: '奏5.json' },
    { kind: 'json', name: '台1.json' },
    { kind: 'json', name: '奏2.json' },
  ];
  const KIND_LABEL = { skill: 'SKILL', code: 'CODE', json: 'JSON' };

  ITEMS.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'upload-card';
    card.dataset.kind = item.kind;
    /* 每張卡片左右位置略有不同，飄浮速度與延遲也錯開，看起來比較自然 */
    const x = 14 + ((i * 23) % 72);
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--rise-dur', `${5.4 + (i % 4) * 0.7}s`);
    card.style.setProperty('--rise-delay', `${i * 0.85}s`);
    card.innerHTML = `
      <span class="upload-card-kind">${KIND_LABEL[item.kind]}</span>
      <span class="upload-card-name">${item.name}</span>`;
    lane.appendChild(card);
  });

  /* 純 CSS 動畫（infinite），只在看得見的時候用 animation-play-state 暫停，
     不需要另外管理計時器。 */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      lane.querySelectorAll('.upload-card').forEach((card) => {
        card.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
      scene.querySelectorAll('.cloud-arrow').forEach((arrow) => {
        arrow.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { threshold: .2 });
  observer.observe(scene);
};
initCloudUploadScene();

/* 試一試（#part-3-try）：三個階段的闖關流程。
   1 下載史料 → 2 在 Codex 視窗逐句組 prompt → 3 比對 OCR 結果。
   左半只畫標示區（不畫標籤）；標示區的位置、大小、顏色由 CSS 變數決定，
   預設值由本函式依 JSON 注入，正式數值寫在 storymap-cards.css 的
   「Part 3.4.10 — 試一試」區塊，以 ID 選擇器覆蓋。
   完成的階段收合成待辦清單；引導文字固定在面板底部，選項放在引導文字下方。 */
const initPart3TryIt = () => {
  const root = document.querySelector('[data-part3-try]');
  if (!root) return;
  const data = parseJsonScript(root);
  if (!data || !data.printed) return;

  const COPY_IC = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">'
    + '<rect x="5.2" y="5.2" width="8.3" height="8.3" rx="1.6"/>'
    + '<path d="M10.8 2.5H3.9c-.8 0-1.4.6-1.4 1.4v6.9"/></svg>';

  const imgEl = root.querySelector('[data-try-img]');
  const hlHost = root.querySelector('[data-try-hls]');
  const indEl = root.querySelector('[data-try-ind]');
  const prevBtn = root.querySelector('[data-try-prev]');
  const nextBtn = root.querySelector('[data-try-next]');
  const todoHost = root.querySelector('[data-try-todo]');
  const stageHost = root.querySelector('[data-try-stage]');
  const scrollHost = root.querySelector('.part3-try-scroll');
  const guideHost = root.querySelector('[data-try-guide]');
  const switchHost = document.querySelector('[data-part3-try-switch]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mode = 'printed';
  let phase = 1;
  let cur = 0;
  let answers = [];
  let pageIdx = 0;
  let compareRaw = '';
  let compareHasRun = false;
  let typingTimer = null;
  const modeStates = Object.fromEntries(Object.keys(data).map((key) => [key, {
    phase: 1,
    cur: 0,
    answers: [],
    pageIdx: 0,
    compareRaw: '',
    compareHasRun: false
  }]));
  const d = () => data[mode];

  const saveModeState = () => {
    modeStates[mode] = {
      phase,
      cur,
      answers: answers.slice(),
      pageIdx,
      compareRaw,
      compareHasRun
    };
  };

  const restoreModeState = () => {
    const saved = modeStates[mode];
    phase = saved.phase;
    cur = saved.cur;
    answers = saved.answers.slice();
    pageIdx = saved.pageIdx;
    compareRaw = saved.compareRaw;
    compareHasRun = saved.compareHasRun;
  };

  /* 標示區的預設幾何值：低權重注入，storymap-cards.css 可用 ID 覆蓋。 */
  const injectDefaults = () => {
    const rules = [];
    Object.keys(data).forEach((m) => {
      const feats = (data[m] && data[m].features) || {};
      Object.keys(feats).forEach((key) => {
        const f = feats[key]; const box = f.box || {};
        rules.push(`[data-part3-try][data-try-mode="${m}"] [data-try-feature="${key}"] {`
          + ` --fx-color: ${f.colour || '#f3c967'};`
          + ` --fx-left: ${box.left || '0%'}; --fx-top: ${box.top || '0%'};`
          + ` --fx-width: ${box.width || '0%'}; --fx-height: ${box.height || '0%'}; }`);
      });
    });
    const style = document.createElement('style');
    style.dataset.part3TryDefaults = 'true';
    style.textContent = rules.join('\n');
    document.head.appendChild(style);
  };
  injectDefaults();

  /* ---------- 左半：史料與標示區 ----------
     恢復成單純一頁一頁顯示：選到某個特徵時，直接把該頁圖片換成該特徵
     的專屬標示圖（不摺、不裁切），沒有特徵時照 pageIdx 顯示原頁面。 */
  const renderDoc = (activeKey) => {
    const set = d();
    const feature = phase === 2 && activeKey ? set.features[activeKey] : null;
    const featureImage = feature && feature.image;
    const visualFile = featureImage || set.pages[pageIdx];
    const assetDir = set.assetDir || '';
    imgEl.src = `${assetDir}${visualFile}`;
    imgEl.alt = featureImage ? `${feature.title || visualFile}示意圖` : '試一試史料頁面';
    imgEl.dataset.tryVisual = featureImage || `page${pageIdx + 1}`;
    /* 只要正在顯示某個特徵的專屬圖片，一律用標題取代「頁X／Y」。 */
    indEl.textContent = featureImage
      ? (feature.title || visualFile.replace(/\.png$/i, ''))
      : `頁 ${pageIdx + 1} / ${set.pages.length}`;
    prevBtn.disabled = Boolean(featureImage) || pageIdx === 0;
    nextBtn.disabled = Boolean(featureImage) || pageIdx === set.pages.length - 1;
    hlHost.innerHTML = '';
    if (featureImage) return;
    Object.keys(set.features).forEach((key) => {
      const f = set.features[key];
      if (f.page !== pageIdx) return;
      const hl = document.createElement('div');
      hl.className = 'part3-try-hl' + (key === activeKey ? ' is-active' : '');
      hl.dataset.tryFeature = key;
      hlHost.appendChild(hl);
    });
  };

  const openTryGallery = (triggerEl) => {
    const set = d();
    const step = phase === 2 ? set.steps[cur] : null;
    const feature = step && step.feature ? set.features[step.feature] : null;
    const assetDir = set.assetDir || '';
    const featurePage = feature && Number.isFinite(feature.page) ? feature.page : pageIdx;
    const modeTitle = mode === 'handwritten' ? '手寫字' : '印刷字';
    const featureTitle = (feature && feature.title) || (step && step.k) || `${modeTitle}史料頁面`;
    const featureDescription = (feature && feature.desc) || (step && step.guide)
      || `${modeTitle}奏摺原件掃描頁面，可使用左右按鈕查看前後頁。`;
    const galleryPages = set.pages.map((src, i) => {
      const annotated = feature && feature.page === i && feature.image;
      return {
        src: assetDir + (annotated ? feature.image : src),
        alt: annotated ? `${featureTitle}：人工標示頁面` : `${modeTitle}奏摺第 ${i + 1} 頁`,
        title: annotated ? featureTitle : `${modeTitle}奏摺第 ${i + 1} 頁`,
        description: annotated ? featureDescription : `${modeTitle}奏摺原件掃描頁面。`
      };
    });
    photoLightbox.openGallery(galleryPages, featurePage, {
      title: `${modeTitle}史料`, captionTitle: '', showPageNumber: false
    }, triggerEl);
  };

  imgEl.title = '點擊放大檢視';
  imgEl.addEventListener('click', () => openTryGallery(imgEl));

  const animateHandwrittenTurn = (direction) => {
    if (mode !== 'handwritten') return;
    const className = direction > 0 ? 'is-handwritten-turn-next' : 'is-handwritten-turn-prev';
    root.classList.remove('is-handwritten-turn-next', 'is-handwritten-turn-prev');
    void root.offsetWidth;
    root.classList.add(className);
    window.setTimeout(() => root.classList.remove(className), 560);
  };
  const syncDoc = () => {
    const step = phase === 2 ? d().steps[cur] : null;
    if (step && step.feature) {
      const f = d().features[step.feature];
      if (f && f.page !== pageIdx) pageIdx = f.page;
      renderDoc(step.feature);
    } else {
      renderDoc(null);
    }
  };

  /* ---------- 底部 RPG 引導框；選項放在引導文字下方 ----------
     第 4 個參數 onClickAdvance：如果提供，代表這一步沒有按鈕，
     整張卡片本身就是「繼續」的按鈕（用於「三 · 版面要求」這類
     單純推進到下一步、不產生 prompt 內容的步驟）。 */
  const showGuide = (kicker, text, buildOptions, onClickAdvance) => {
    clearTimeout(typingTimer);
    guideHost.hidden = false;
    guideHost.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'part3-try-rpg' + (onClickAdvance ? ' is-advance' : '');
    box.innerHTML = `<span class="k">${kicker}</span><span class="t"></span>`
      + (onClickAdvance
        ? `<span class="caret part3-try-advance-hint" aria-hidden="true">點擊卡片繼續 →</span>`
        : `<span class="caret" aria-hidden="true">▼</span>`);
    guideHost.appendChild(box);
    if (onClickAdvance) {
      box.tabIndex = 0;
      box.setAttribute('role', 'button');
      box.setAttribute('aria-label', `${kicker}：繼續`);
      box.addEventListener('click', onClickAdvance, { once: true });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClickAdvance(); }
      }, { once: true });
    }
    const t = box.querySelector('.t');
    const addOptions = () => {
      if (!buildOptions) return;
      const opts = document.createElement('div');
      opts.className = 'part3-try-opts';
      buildOptions(opts);
      box.insertBefore(opts, box.querySelector('.caret'));
    };
    if (reduceMotion) { t.textContent = text; addOptions(); return; }
    let i = 0;
    const tick = () => {
      t.textContent = text.slice(0, ++i);
      if (i < text.length) typingTimer = setTimeout(tick, 12);
      else addOptions();
    };
    tick();
  };

  /* 進度改用純數字圓點：不重複顯示步驟名稱，注意力留給下面目前的視窗。
     三個階段固定：1 下載史料 · 2 撰寫 Prompt · 3 比對結果。 */
  const PHASE_COUNT = 3;
  const renderProgress = () => {
    const dots = Array.from({ length: PHASE_COUNT }, (_, i) => {
      const n = i + 1;
      const state = n < phase ? 'done' : n === phase ? 'current' : 'pending';
      return `<span class="part3-try-dot is-${state}" aria-hidden="true">${n}</span>`;
    }).join('');
    todoHost.innerHTML = `<div class="part3-try-progress"><span class="cap">進度</span>${dots}</div>`;
    const progressRow = todoHost.firstElementChild;
    if (switchHost && progressRow) progressRow.appendChild(switchHost);
  };

  /* ---------- 第一步：下載史料 ---------- */
  const renderPhase1 = () => {
    if (scrollHost) { scrollHost.classList.remove('is-chat'); scrollHost.classList.remove('is-cmp'); }
    const set = d();
    const pdfSource = set.pdfPath || set.href || '';
    stageHost.innerHTML = `
      <div class="part3-try-win">
        <div class="part3-try-winbar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">第一步 · 下載史料</span></div>
        <div class="part3-try-dl" data-try-pdf-source="${pdfSource}">
          <div class="meta"><div class="name">${set.pdf}</div><div class="sub">${set.pdfSub}</div></div>
          <div class="part3-try-dl-actions">
            <button type="button" class="part3-try-dlbtn" data-try-dl data-try-pdf-source="${pdfSource}">下載</button>
            <button type="button" class="part3-try-already" data-try-already>已下載</button>
          </div>
        </div>
      </div>`;
    showGuide('第一步', isTryMobile()
      ? '先把這份史料下載到你的手機。'
      : '先把這份史料下載到你的電腦。');
    const advanceToPrompt = (openPdf) => {
      const pdfHref = set.href || set.pdfPath;
      if (openPdf && pdfHref) window.open(pdfHref, '_blank', 'noopener');
      phase = 2; cur = 0; answers = [];
      compareRaw = ''; compareHasRun = false;
      saveModeState();
      renderProgress();
      renderPhase2();
    };
    stageHost.querySelector('[data-try-dl]').addEventListener('click', () => advanceToPrompt(true));
    stageHost.querySelector('[data-try-already]').addEventListener('click', () => advanceToPrompt(false));
    syncDoc();
  };

  /* ---------- 第二步：Codex 視窗撰寫 prompt ---------- */
  const addBubble = (text, instant) => {
    const chat = stageHost.querySelector('[data-try-chat]');
    const row = document.createElement('div');
    row.className = 'part3-try-bubblerow';
    const b = document.createElement('div');
    b.className = 'part3-try-bubble';
    row.appendChild(b);
    chat.appendChild(row);
    const scroll = () => { chat.scrollTop = chat.scrollHeight; };
    const finish = () => { b.contentEditable = 'true'; b.spellcheck = false; };
    if (instant || reduceMotion) { b.textContent = text; finish(); scroll(); return Promise.resolve(); }
    return new Promise((res) => {
      let i = 0;
      const tick = () => {
        b.textContent = text.slice(0, ++i); scroll();
        if (i < text.length) setTimeout(tick, 7); else { finish(); res(); }
      };
      tick();
    });
  };

  const scrollChatToLatest = () => {
    const chat = stageHost.querySelector('[data-try-chat]');
    if (chat) chat.scrollTop = chat.scrollHeight;
  };

  const nextStep = () => {
    saveModeState();
    scrollChatToLatest();
    const steps = d().steps;

    if (cur >= steps.length) {
      /* 完整 prompt 都出來了：讓聊天視窗長高一點，方便一次看到更多內容。
         整個「試一試」遊戲視窗的高度（--try-explorer-h）不變，
         只有這個視窗自己在可捲動的面板裡變高。 */
      const chatEl = stageHost.querySelector('[data-try-chat]');
      if (chatEl) chatEl.classList.add('is-final');
      const foot = stageHost.querySelector('[data-try-foot]');
      foot.innerHTML = `<span class="hint">點擊Prompt進行修改</span>`
        + `<button type="button" class="part3-try-copy" data-try-copy>${COPY_IC}複製全部</button>`;
      showGuide('完成', isTryMobile()
        ? '以上就是給 AI 的 OCR prompt。點選各項 Prompt 可以直接修改。確認後按「複製全部」，再到 AI App（例如 ChatGPT，工作模式或聊天模式都可以）開一則新訊息：先上傳剛才下載的 PDF，然後貼上這段 prompt 一起送出。'
        : '以上就是寫給Agentic Ai進行OCR的 prompt。直接點選各項 Prompt 進行修改，確認內容後，複製再發給 Agentic AI 執行');
      foot.querySelector('[data-try-copy]').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const txt = [...stageHost.querySelectorAll('.part3-try-bubble')]
          .map((b) => b.textContent.trim()).filter(Boolean).join('\n');
        if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
        btn.classList.add('is-done');
        btn.innerHTML = COPY_IC + '已複製';
        setTimeout(() => {
          phase = 3;
          saveModeState();
          renderProgress();
          renderPhase3();
        }, 500);
      });
      syncDoc();
      return;
    }

    const s = steps[cur];

    /* 「advance」：沒有按鈕、不產生 prompt 內容，點整張引導卡片就進下一步。 */
    if (s.kind === 'advance') {
      showGuide(s.k, s.guide, null, () => { cur += 1; nextStep(); });
      syncDoc();
      return;
    }

    showGuide(s.k, s.guide, (opts) => {
      if (s.kind === 'chip') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'part3-try-chip';
        btn.textContent = s.chip;
        btn.addEventListener('click', () => {
          opts.remove();
          answers[cur] = s.chip;
          addBubble(s.chip).then(() => { cur += 1; nextStep(); });
        });
        opts.appendChild(btn);
        /* 可選的第二顆按鈕（例如「已下載」）：點了就跳過，
           不把建議句子送進聊天視窗、也不加入最後的 prompt。 */
        if (s.skip) {
          const skipBtn = document.createElement('button');
          skipBtn.type = 'button';
          skipBtn.className = 'part3-try-chip part3-try-chip--skip';
          skipBtn.textContent = s.skip;
          skipBtn.addEventListener('click', () => {
            opts.remove();
            answers[cur] = '';
            cur += 1;
            nextStep();
          });
          opts.appendChild(skipBtn);
        }
      }

      if (s.kind === 'mc') {
        const p = document.createElement('p');
        p.className = 'part3-try-sentence';
        p.append(s.before + ' ');
        const sel = document.createElement('select');
        sel.className = 'part3-try-blank';
        sel.innerHTML = '<option value="">—— 請選擇 ——</option>'
          + shuffleTryOptions(s.options).map((o) => `<option>${o}</option>`).join('');
        const mark = document.createElement('span');
        mark.className = 'part3-try-mark';
        sel.addEventListener('change', () => {
          if (!sel.value) return;
          if (sel.value === s.answer) {
            sel.classList.remove('is-bad'); sel.classList.add('is-ok');
            mark.className = 'part3-try-mark ok'; mark.textContent = '✓';
            const line = s.before + s.answer + s.after;
            answers[cur] = line;
            setTimeout(() => {
              opts.remove();
              addBubble(line).then(() => { cur += 1; nextStep(); });
            }, 300);
          } else {
            sel.classList.remove('is-ok'); sel.classList.add('is-bad');
            mark.className = 'part3-try-mark bad'; mark.textContent = '✗';
            setTimeout(() => {
              sel.value = ''; sel.classList.remove('is-bad'); mark.textContent = '';
            }, 650);
          }
        });
        p.appendChild(sel); p.append(' ' + s.after); p.appendChild(mark);
        opts.appendChild(p);
      }

      /* 「mc2」：一句話裡有兩個填空，兩個都答對才算完成
         （例如 4.4 正文：「正文請【　】，【　】抬頭引致的分段。」）。 */
      if (s.kind === 'mc2') {
        const p = document.createElement('p');
        p.className = 'part3-try-sentence';
        p.append(s.before + ' ');
        const makeBlank = (options, answer) => {
          const sel = document.createElement('select');
          sel.className = 'part3-try-blank';
          sel.innerHTML = '<option value="">—— 請選擇 ——</option>'
            + shuffleTryOptions(options).map((o) => `<option>${o}</option>`).join('');
          const mark = document.createElement('span');
          mark.className = 'part3-try-mark';
          sel.addEventListener('change', () => {
            if (!sel.value) return;
            if (sel.value === answer) {
              sel.classList.remove('is-bad'); sel.classList.add('is-ok');
              mark.className = 'part3-try-mark ok'; mark.textContent = '✓';
              checkBothDone();
            } else {
              sel.classList.remove('is-ok'); sel.classList.add('is-bad');
              mark.className = 'part3-try-mark bad'; mark.textContent = '✗';
              setTimeout(() => {
                sel.value = ''; sel.classList.remove('is-bad'); mark.textContent = '';
              }, 650);
            }
          });
          return { sel, mark };
        };
        const b1 = makeBlank(s.options1, s.answer1);
        const b2 = makeBlank(s.options2, s.answer2);
        const checkBothDone = () => {
          if (!b1.sel.classList.contains('is-ok') || !b2.sel.classList.contains('is-ok')) return;
          const line = s.before + s.answer1 + (s.mid || '') + s.answer2 + (s.after || '');
          answers[cur] = line;
          setTimeout(() => {
            opts.remove();
            addBubble(line).then(() => { cur += 1; nextStep(); });
          }, 300);
        };
        p.appendChild(b1.sel); p.appendChild(b1.mark);
        p.append(' ' + (s.mid || '') + ' ');
        p.appendChild(b2.sel); p.appendChild(b2.mark);
        p.append(' ' + (s.after || ''));
        opts.appendChild(p);
      }

      /* 「choice」：不嵌在句子裡的獨立二選一（或多選一）按鈕，
         答對後仍組成 before+answer+after 的句子加入 prompt。 */
      if (s.kind === 'choice') {
        const row = document.createElement('div');
        row.className = 'part3-try-choices';
        (s.options || []).forEach((opt) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'part3-try-choice';
          btn.textContent = opt;
          btn.addEventListener('click', () => {
            if (opt === s.answer) {
              btn.classList.add('is-ok');
              row.querySelectorAll('button').forEach((b) => { if (b !== btn) b.disabled = true; });
              const line = (s.before || '') + s.answer + (s.after || '');
              answers[cur] = line;
              setTimeout(() => {
                opts.remove();
                addBubble(line).then(() => { cur += 1; nextStep(); });
              }, 300);
            } else {
              btn.classList.add('is-bad');
              setTimeout(() => btn.classList.remove('is-bad'), 550);
            }
          });
          row.appendChild(btn);
        });
        opts.appendChild(row);
      }

      if (s.kind === 'free') {
        const ta = document.createElement('textarea');
        ta.className = 'part3-try-free';
        ta.placeholder = s.placeholder || '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'part3-try-optbtn';
        btn.textContent = '完成';
        btn.addEventListener('click', () => {
          const v = ta.value.trim();
          answers[cur] = v;
          opts.remove();
          const done = () => { cur += 1; nextStep(); };
          if (v) addBubble(v).then(done); else done();
        });
        opts.appendChild(ta); opts.appendChild(btn);
      }

      /* 「multi」：複選——把 items 全部打勾才能完成，沒有干擾選項，
         全選之後把它們依原本列出的順序組成一句 prompt。
         inline:true 時，勾選框直接嵌在句子裡（適合 2–3 個項目）；
         不設 inline 時維持原本「一排選項卡片＋完成按鈕」的做法
         （適合像史料資訊這種項目較多、放進句子裡會太長的情況）。 */
      if (s.kind === 'multi' && s.inline) {
        const items = s.items || [];
        const p = document.createElement('p');
        p.className = 'part3-try-sentence';
        p.append(s.before || '');
        items.forEach((label, i) => {
          const wrap = document.createElement('label');
          wrap.className = 'part3-try-check';
          wrap.innerHTML = `${label}<input type="checkbox"><span class="chk" aria-hidden="true"></span>`;
          const input = wrap.querySelector('input');
          input.addEventListener('change', () => {
            wrap.classList.toggle('is-checked', input.checked);
            if (items.every((_, j) => p.querySelectorAll('input[type="checkbox"]')[j].checked)) {
              setTimeout(() => {
                const line = (s.before || '') + items.join('、') + (s.after || '');
                opts.remove();
                answers[cur] = line;
                addBubble(line).then(() => { cur += 1; nextStep(); });
              }, 300);
            }
          });
          p.appendChild(wrap);
          if (i < items.length - 1) p.append('、');
        });
        p.append(s.after || '');
        opts.appendChild(p);
      } else if (s.kind === 'multi') {
        /* items：必須全部勾選才算完成；wrong（可省略）：干擾選項，
           混在同一排卡片裡，勾了反而不能完成，需要使用者自己取消。 */
        const items = s.items || [];
        const wrongItems = s.wrong || [];
        /* 按鈕本身隨機排列（每次進到這一步重新洗牌一次，選的時候不會又跳動），
           但送進聊天視窗的句子永遠照 items 原本寫的固定順序組合，不受點擊順序影響。 */
        const pool = shuffleTryOptions([...items, ...wrongItems]);
        const list = document.createElement('div');
        list.className = 'part3-try-multi';
        const selected = new Set();
        /* 選的時候一律用中性的「已選」樣式，看不出對錯；
           只有按下「完成」之後才會短暫變色（紅＝選錯），
           之後只要再點任何一顆卡片就會恢復中性、要重新按完成才會再揭曉。 */
        let revealed = false;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'part3-try-optbtn';
        btn.textContent = '完成，加入 prompt';
        /* 按鈕一開始就可以按：不管選了幾個、選對還是選錯，按下去都會
           判斷一次——答對就送出，答錯就用抖動＋變紅提醒，讓使用者自己修正。 */
        const isReady = () => items.every((label) => selected.has(label))
          && wrongItems.every((label) => !selected.has(label));
        const renderItems = () => {
          list.innerHTML = '';
          pool.forEach((label) => {
            const isWrong = wrongItems.includes(label);
            const isPicked = selected.has(label);
            let stateClass = '';
            if (isPicked) stateClass = (revealed && isWrong) ? ' is-wrong' : ' is-selected';
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'part3-try-multi-item' + stateClass;
            chip.innerHTML = `<span class="chk" aria-hidden="true"></span>${label}`;
            chip.addEventListener('click', () => {
              if (selected.has(label)) selected.delete(label); else selected.add(label);
              revealed = false;
              renderItems();
            });
            list.appendChild(chip);
          });
        };
        renderItems();
        btn.addEventListener('click', () => {
          revealed = true;
          renderItems();
          if (!isReady()) {
            btn.classList.remove('is-bad'); void btn.offsetWidth; btn.classList.add('is-bad');
            setTimeout(() => btn.classList.remove('is-bad'), 550);
            return;
          }
          const line = (s.before || '') + items.join('、') + (s.after || '');
          opts.remove();
          answers[cur] = line;
          addBubble(line).then(() => { cur += 1; nextStep(); });
        });
        opts.appendChild(list); opts.appendChild(btn);
      }
    });
    syncDoc();
  };

  const renderPhase2 = () => {
    if (scrollHost) { scrollHost.classList.add('is-chat'); scrollHost.classList.remove('is-cmp'); }
    stageHost.innerHTML = `
      <div class="part3-try-win">
        <div class="part3-try-winbar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">第二步 · 撰寫給 Agentic AI 的 Prompt</span></div>
        <div class="part3-try-chat" data-try-chat></div>
        <div class="part3-try-chatfoot" data-try-foot></div>
      </div>`;
    answers.slice(0, cur).forEach((a) => { if (a) addBubble(a, true); });
    nextStep();
    scrollChatToLatest();
  };

  /* ---------- 第三步：比對 OCR 結果（淺色視窗） ----------
     版面固定為上下兩個文字框：上＝參考 OCR 結果、下＝使用者貼上的結果，
     各佔視窗高度的一半（吻合度列與按鈕列不計入這一半一半的高度）。
     比對後的差異直接以底線／紅字等樣式標示在這兩個文字框的文字裡，
     不再另外用逐欄位表格呈現。 */
  const refAsJson = () => {
    try {
      const parsed = JSON.parse(d().reference);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const downloadRef = () => {
    const asJson = refAsJson();
    const text = asJson ? JSON.stringify(asJson, null, 2) : d().reference;
    const blob = new Blob([text], { type: asJson ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = mode + '-reference-ocr.' + (asJson ? 'json' : 'txt');
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* 畫出上下兩個文字框＋（可有可無的）吻合度列與按鈕列。
     scoreVal 為 null 時代表尚未比對過，不顯示吻合度列，按鈕文字也不同。 */
  const paintCmp = (scoreVal, refHtml, mineHtml, mineRaw) => {
    const body = stageHost.querySelector('[data-try-cmp]');
    body.innerHTML = `
      ${scoreVal !== null ? `<div class="part3-try-score"><span class="lab">吻合度</span><span class="num">${scoreVal}%</span></div>` : ''}
      <div class="part3-try-cmpstack">
        <div class="part3-try-cmpbox">
          <span class="lab">參考 OCR 結果</span>
          <div class="part3-try-cmptext" data-try-refpane>${refHtml}</div>
        </div>
        <div class="part3-try-cmpbox">
          <span class="lab">你的 OCR 結果（可直接修改後重新比對）</span>
          <div class="part3-try-cmptext is-editable" data-try-input contenteditable="true" spellcheck="false"></div>
        </div>
      </div>
      <div class="part3-try-cmprow">
        <button type="button" class="part3-try-cmpbtn primary" data-try-run>${scoreVal !== null ? '重新比對' : '比較參考結果'}</button>
        <span class="spacer"></span>
        <button type="button" class="part3-try-cmpbtn" data-try-refdl>下載參考 OCR 結果</button>
      </div>`;
    const mineEl = body.querySelector('[data-try-input]');
    if (mineHtml !== null) mineEl.innerHTML = mineHtml;
    else mineEl.textContent = mineRaw || '';
    mineEl.addEventListener('input', () => {
      compareRaw = mineEl.textContent;
      compareHasRun = false;
      saveModeState();
    });
    body.querySelector('[data-try-run]').addEventListener('click', () => {
      runCompare(body.querySelector('[data-try-input]').textContent);
    });
    body.querySelector('[data-try-refdl]').addEventListener('click', downloadRef);
  };

  const runCompare = (raw) => {
    const mine = (raw || '').replace(/\s+/g, '');
    compareRaw = raw || '';
    if (!mine) {
      compareHasRun = false;
      saveModeState();
      const refJson = refAsJson();
      const refPlain = refJson ? JSON.stringify(refJson, null, 2) : d().reference;
      paintCmp(null, escHtml(refPlain), null, raw);
      const mineEl = stageHost.querySelector('[data-try-input]');
      if (mineEl) mineEl.focus();
      return;
    }
    compareHasRun = true;
    saveModeState();
    const refJson = refAsJson();
    const refSource = refJson ? JSON.stringify(refJson) : d().reference;
    const ref = refSource.replace(/\s+/g, '');
    const result = diffTryChars(ref, mine);
    const refHtml = result.merged.filter((seg) => seg[0] !== 'extra')
      .map((seg) => `<span class="${seg[0]}">${escHtml(seg[1])}</span>`).join('');
    const mineHtml = result.merged.filter((seg) => seg[0] !== 'miss')
      .map((seg) => `<span class="${seg[0]}">${escHtml(seg[1])}</span>`).join('');
    paintCmp(result.score, refHtml, mineHtml, raw);

    /* 比對過一次後，收起底部的引導對話框，讓比對視窗延伸到面板底部，
       騰出更多空間顯示兩個文字框。 */
    if (guideHost) guideHost.hidden = true;
  };

  const renderPhase3 = () => {
    if (scrollHost) { scrollHost.classList.remove('is-chat'); scrollHost.classList.add('is-cmp'); }
    stageHost.innerHTML = `
      <div class="part3-try-win">
        <div class="part3-try-winbar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl">第三步 · 比較 OCR 結果</span></div>
        <div class="part3-try-cmp" data-try-cmp></div>
      </div>`;
    const refJson = refAsJson();
    const refPlain = refJson ? JSON.stringify(refJson, null, 2) : d().reference;
    paintCmp(null, escHtml(refPlain), null, compareRaw);
    showGuide('第三步', 'AI 完成 OCR 後，請將結果貼到下方的文字框，與上方的參考結果進行比較，看看是否需要修改 OCR Prompt。 ');
    syncDoc();
    if (compareHasRun && compareRaw) runCompare(compareRaw);
  };

  /* ---------- 翻頁與模式切換 ---------- */
  prevBtn.addEventListener('click', () => {
    animateHandwrittenTurn(-1);
    pageIdx = (pageIdx - 1 + d().pages.length) % d().pages.length;
    syncDoc();
  });
  nextBtn.addEventListener('click', () => {
    animateHandwrittenTurn(1);
    pageIdx = (pageIdx + 1) % d().pages.length;
    syncDoc();
  });

  const resetAll = () => {
    clearTimeout(typingTimer);
    phase = 1; cur = 0; answers = []; pageIdx = 0;
    compareRaw = ''; compareHasRun = false;
    saveModeState();
    renderProgress();
    renderPhase1();
  };

  const renderCurrentPhase = () => {
    renderProgress();
    if (phase === 1) renderPhase1();
    else if (phase === 2) renderPhase2();
    else renderPhase3();
  };

  if (switchHost) {
    switchHost.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || !data[btn.dataset.tryMode]) return;
      saveModeState();
      mode = btn.dataset.tryMode;
      restoreModeState();
      root.dataset.tryMode = mode;
      [...switchHost.children].forEach((b) => b.classList.toggle('is-on', b === btn));
      renderCurrentPhase();
    });
  }

  resetAll();
};

/* 字元層級 LCS：比對參考結果與使用者貼上的 OCR 結果。 */
function diffTryChars(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0, j = 0, lcs = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push(['same', a[i]]); i++; j++; lcs++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(['miss', a[i]]); i++; }
    else { out.push(['extra', b[j]]); j++; }
  }
  while (i < n) out.push(['miss', a[i++]]);
  while (j < m) out.push(['extra', b[j++]]);
  const merged = [];
  out.forEach((seg) => {
    const last = merged[merged.length - 1];
    if (last && last[0] === seg[0]) last[1] += seg[1];
    else merged.push([seg[0], seg[1]]);
  });
  return { merged, score: n + m === 0 ? 0 : Math.round((2 * lcs / (n + m)) * 100) };
}

function shuffleTryOptions(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* ---------------------------------------------------------------------------
   試一試：手機版文案覆寫
   手機上的操作方式跟電腦不一樣——不是在本機安裝 PaddleOCR，而是把 PDF 上傳到
   AI App（例如 ChatGPT，工作模式或聊天模式都可以），再請它用 PaddleOCR 辨識。
   因此手機版要換掉幾句提示，並把「二 · OCR 目的」併進第一步（同一句話就講完了）。
   必須在 initPart3TryIt() 解析 data-part3-try-data 之前改寫，才會生效。
   --------------------------------------------------------------------------- */
const TRY_MOBILE_MQ = window.matchMedia('(pointer: coarse) and (hover: none), (max-width: 1040px)');
const isTryMobile = () => TRY_MOBILE_MQ.matches;

const applyMobileTryText = () => {
  if (!isTryMobile()) return;
  const script = document.querySelector('[data-part3-try-data]');
  if (!script) return;
  let data;
  try { data = JSON.parse(script.textContent); } catch (e) { return; }

  ['printed', 'handwritten'].forEach((mode) => {
    const set = data[mode];
    if (!set || !Array.isArray(set.steps)) return;
    /* 「二 · OCR 目的」在手機版併進第一步，整步移除 */
    set.steps = set.steps.filter((s) => s.k !== '二 · OCR 目的');
    const first = set.steps.find((s) => s.k === '一 · 安裝工具');
    if (first) {
      first.k = '一 · 指示 AI 使用 PaddleOCR';
      first.guide = '手機上不用自己安裝工具：把剛才下載的 PDF 上傳到 AI App（例如 ChatGPT，工作模式或聊天模式都可以），再請它用 PaddleOCR 辨識。';
      first.chip = `請使用 PaddleOCR，為我 OCR 這份 PDF：「${set.pdf}」。`;
      delete first.skip;
    }
  });
  script.textContent = JSON.stringify(data);
};
applyMobileTryText();

initPart3TryIt();

/* ---------------------------------------------------------------------------
   選用的 AI Model：手機版兩頁垂直模型卡
   桌面版維持六欄比較表；手機版先顯示 Claude／GPT，再用第一張卡的箭頭
   切換至 DeepSeek／Gemini。
   --------------------------------------------------------------------------- */
const initPart3ModelMobile = () => {
  const table = document.querySelector('#part-3-model .part3-model-table');
  if (!table) return;
  const buttons = [...table.querySelectorAll('[data-model-mobile-next]')];
  if (!buttons.length) return;
  let page = 'primary';
  const setPage = (next) => {
    page = next;
    table.dataset.mobilePage = page;
    buttons.forEach((button) => {
      const secondary = page === 'secondary';
      button.textContent = secondary ? '←' : '→';
      button.setAttribute('aria-label', secondary
        ? '返回 Claude Opus 和 GPT（5.6）'
        : '查看 DeepSeek Flash／Pro 和 Gemini Flash');
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    setPage(page === 'primary' ? 'secondary' : 'primary');
  }));
  setPage(page);
};
initPart3ModelMobile();

const activateFromLocation = () => {
  const hash = window.location.hash || '#cover';
  const tabName = panelForHash(hash);
  const nestedTarget = (tabName === 'intro' && hash.startsWith('#intro-'))
    || (tabName === 'part-3' && hash !== '#part-3') ? hash : null;
  setActiveTab(tabName, { updateHash: false, scrollTarget: nestedTarget });
};
window.addEventListener('popstate', activateFromLocation);
window.addEventListener('hashchange', activateFromLocation);
activateFromLocation();

/* ---------- 教師預覽模式（網址加上 ?preview=ocr）----------
   給老師看草稿用的專用連結，不是另外複製一個網站：同一份 storymap.js／
   storymap.css，加上這個網址參數才會啟動以下限制，平常瀏覽網站（不帶這個
   參數）完全不受影響：
   - 分頁只保留「平台簡介」與「運用平台研究其他問題」可以點擊，其餘（主頁、
     平台介面、平台運作流程）維持看得見但不能點。
   - 一進入頁面就直接跳到第三部分「步驟二 · OCR 並結構化原始史料」。
   - 只留步驟二・OCR並結構化原始史料完全開放；步驟二之前（適合的研究問題／
     所需的工具與資源／重用平台的基本流程）、步驟三至五・運用AI抽取資訊、
     以及步驟八之後（後續功能：LLM Wiki）的內容維持在畫面上，但變淡、
     不能點擊，並標示「尚在開發中」。
   分享給老師的連結範例：storymap-example.html?preview=ocr */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('preview') !== 'ocr') return;

  document.documentElement.classList.add('is-ocr-preview');

  /* 鎖住分頁：用 cloneNode 把整個節點換掉，藉此清掉原本 tabs.forEach
     （在檔案最前面）已經掛在這個節點上的 click 監聽器——同一個節點上的
     監聽器是照註冊順序依序觸發，不分 capture／bubble，光是在這裡另外
     addEventListener 沒辦法搶在原本的監聽器之前執行 preventDefault，
     所以單純呼叫 preventDefault 攔不住原本那個監聽器已經呼叫的
     setActiveTab()，分頁還是會切換過去。換成全新節點就不會有這個問題。 */
  const lockLink = (el, label) => {
    if (!el) return null;
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    clone.classList.add('is-preview-locked-tab');
    clone.setAttribute('aria-disabled', 'true');
    clone.title = label;
    clone.addEventListener('click', (event) => { event.preventDefault(); });
    return clone;
  };
  const lockLabel = '這個草稿預覽只開放「平台簡介」與「運用平台研究其他問題」兩個部分';
  lockLink(document.querySelector('.brand'), lockLabel);
  const LOCKED_TAB_TARGETS = ['cover', 'part-1', 'part-2'];
  tabs.forEach((tab) => {
    if (LOCKED_TAB_TARGETS.includes(tab.dataset.navTarget)) {
      lockLink(tab, lockLabel);
    } else if (tab.dataset.navTarget === 'part-3') {
      /* 就算之後再點一次「運用平台研究其他問題」，也固定回到步驟二，
         不要停在步驟二之前那些已變淡鎖住的內容最上面。 */
      tab.addEventListener('click', () => {
        setActiveTab('part-3', { scrollTarget: '#part-3-ocr' });
      });
    }
  });

  /* 只留步驟二完全開放；步驟二之前的三個小節、步驟三至五（#part-3-ai）、
     以及步驟八之後（#part-3-wiki）都變淡鎖住。 */
  const LOCKED_SECTION_IDS = [
    'part-3-research-questions', 'part-3-tools', 'part-3-basic-flow',
    'part-3-ai', 'part-3-wiki'
  ];
  LOCKED_SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-preview-faded');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('inert', ''); /* 連鍵盤 Tab 也跳過這個區塊；不支援的舊瀏覽器會忽略此屬性，不影響上面的視覺與滑鼠鎖定 */
    const badge = document.createElement('div');
    badge.className = 'preview-faded-badge';
    badge.textContent = '此部分尚在開發中，暫未開放於此預覽';
    el.prepend(badge);
  });

  /* 不論網址原本帶什麼 hash，教師預覽一律直接跳到步驟二。 */
  setActiveTab('part-3', { updateHash: false, scrollTarget: '#part-3-ocr' });
})();

/* ---------------------------------------------------------------------------
   手機版：史料抽屜（7 辨識印刷字 / 8 辨識手寫字 / 11 試一試）
   桌面版完全不動：只是把原本的史料欄 .part3-fx-doc 包進一層 <aside class="mdrawer">，
   而該 aside 在桌面版是 display:contents（外框不存在），史料欄仍是 grid 的直接子元素。
   手機版（≤820px）才由 CSS 把 aside 變成從左邊拉出的固定抽屜。
   因為 aside 仍在 explorer root 之內，既有程式碼的 root.querySelector(...) 全部照舊有效。
   --------------------------------------------------------------------------- */
const initMobileDocDrawers = () => {
  /* 全站同時只允許一個抽屜打開：打開新的之前先把其他的關掉，
     避免兩個 fixed 抽屜疊在一起、關掉上面那個之後下面還留著。 */
  const closers = [];
  const IC = {
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    ex:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-8 8M3 21l8-8"/></svg>',
    sh:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 9h-6V3M3 15h6v6M15 9l6-6M9 15l-6 6"/></svg>',
    cl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6v12M15 6v12"/></svg>'
  };

  /* 只有 7／8 用抽屜。11 試一試在手機版把 PDF 直接放進視窗裡，
     由下面的 initMobileTryLayout() 處理，不需要抽屜。 */
  document.querySelectorAll('#part-3-printed-explorer, #part-3-handwritten-explorer')
    .forEach((root) => {
      const doc = root.querySelector('.part3-fx-doc');
      const panel = root.querySelector('[data-part3-fx-out]') || root.querySelector('.part3-try-panel');
      if (!doc || !panel || doc.closest('.mdrawer')) return;

      /* 1. 把史料欄包進抽屜外框（桌面版 display:contents，等於沒有這層） */
      const drawer = document.createElement('aside');
      drawer.className = 'mdrawer';
      drawer.setAttribute('aria-label', '史料圖');
      doc.parentNode.insertBefore(drawer, doc);
      const bar = document.createElement('div');
      bar.className = 'mdrawer-bar';
      bar.innerHTML = '<span class="mdrawer-no"></span><span class="t"></span>';
      drawer.appendChild(bar);
      drawer.appendChild(doc);
      drawer.insertAdjacentHTML('beforeend', `
        <div class="mdrawer-edge l">上一頁</div>
        <div class="mdrawer-edge r">下一頁</div>
        <div class="mdrawer-foot">
          <button type="button" data-m-prev aria-label="上一個特徵">${IC.prev}</button>
          <button type="button" data-m-next aria-label="下一個特徵">${IC.next}</button>
          <button type="button" data-m-full aria-label="整頁／縮小">${IC.ex}</button>
          <button type="button" data-m-close aria-label="收起">${IC.cl}</button>
        </div>
        <button type="button" class="mdrawer-grip" data-m-grip aria-label="調整寬度">${IC.grip}</button>`);

      /* 2. 拉手與遮罩（固定在視窗上，只有捲到這一節時才出現） */
      const puller = document.createElement('button');
      puller.type = 'button';
      puller.className = 'mdrawer-puller';
      puller.setAttribute('aria-label', '拉出史料圖');
      puller.innerHTML = '<span class="arw">›</span><span class="lab">史料</span>';
      const scrim = document.createElement('div');
      scrim.className = 'mdrawer-scrim';
      root.appendChild(scrim);
      root.appendChild(puller);

      const titleEl = bar.querySelector('.t');
      const noEl = bar.querySelector('.mdrawer-no');
      const edgeL = drawer.querySelector('.mdrawer-edge.l');
      const edgeR = drawer.querySelector('.mdrawer-edge.r');
      const fullBtn = drawer.querySelector('[data-m-full]');
      const grip = drawer.querySelector('[data-m-grip]');
      let zoom = 1;
      const setZoom = (z) => { zoom = Math.max(1, Math.min(4, z)); drawer.style.setProperty('--z', zoom); };

      /* 3. 版面特徵：沿用既有的標籤按鈕，另外在面板上方做一排膠囊按鈕。
            點膠囊 = 點原本的標籤，所有既有邏輯（換圖、逐字播放）完全不改。 */
      /* 重要：既有的 buildTags() 每次 render 都會把 tagHost.innerHTML 清空重建，
         所以絕對不能把標籤節點存起來重複使用——存下來的會立刻變成脫離 DOM 的
         舊節點，膠囊點了沒反應、狀態也同步不到。一律每次現查。 */
      const tagHost = root.querySelector('[data-part3-fx-tags]');
      const liveTags = () => (tagHost ? [...tagHost.querySelectorAll('.part3-fx-tag')] : []);
      const tags = liveTags();
      let chips = [];
      if (tags.length) {
        const filter = document.createElement('div');
        filter.className = 'mfilter';
        filter.innerHTML = '<span class="mfilter-lab">選擇版面特徵</span><div class="mfilter-row"></div>';
        const row = filter.querySelector('.mfilter-row');
        tags.forEach((tag, i) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'mchip';
          chip.textContent = tag.textContent;
          chip.addEventListener('click', () => {
            const live = liveTags()[i];
            if (live) live.click();
          });
          row.appendChild(chip);
          chips.push(chip);
        });
        panel.insertBefore(filter, panel.firstChild);
      }

      /* 標籤的 is-active 由既有程式碼維護；照著同步膠囊與抽屜標題。 */
      const syncFromTags = () => {
        const live = liveTags();
        const i = live.findIndex((t) => t.classList.contains('is-active'));
        chips.forEach((c, n) => c.setAttribute('aria-pressed', String(n === i)));
        if (i >= 0 && live[i]) {
          noEl.textContent = String(i + 1);
          titleEl.textContent = live[i].textContent;
          if (chips[i]) chips[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          setZoom(1);
        }
      };
      if (tags.length) {
        syncFromTags();
        /* 觀察 tagHost 本身（childList），才抓得到「整批重建」；
           subtree+attributes 則抓得到 is-active 的切換。 */
        new MutationObserver(syncFromTags).observe(tagHost, {
          childList: true, subtree: true, attributes: true, attributeFilter: ['class']
        });
      } else {
        /* 11 試一試：沒有特徵標籤，抽屜標題就用頁碼指示器 */
        const ind = root.querySelector('[data-try-ind]');
        const syncTry = () => { titleEl.textContent = (ind && ind.textContent) || '史料'; };
        syncTry();
        if (ind) new MutationObserver(syncTry).observe(ind, { childList: true, characterData: true, subtree: true });
      }

      /* 4. 開關、展開、縮放、換特徵 */
      const setOpen = (on) => {
        if (on) closers.forEach((fn) => fn !== setOpen && fn(false));
        drawer.classList.toggle('is-open', on);
        scrim.classList.toggle('is-on', on);
        puller.setAttribute('aria-expanded', String(on));
      };
      closers.push(setOpen);
      puller.addEventListener('click', () => setOpen(true));
      scrim.addEventListener('click', () => setOpen(false));
      drawer.querySelector('[data-m-close]').addEventListener('click', () => setOpen(false));
      fullBtn.addEventListener('click', () => {
        const full = drawer.classList.toggle('is-full');
        fullBtn.innerHTML = full ? IC.sh : IC.ex;
        setZoom(1);
      });

      const stepFeature = (dir) => {
        if (!tags.length) {
          /* 11 試一試沒有特徵，方向鍵改為翻頁 */
          const btn = root.querySelector(dir > 0 ? '[data-try-next]' : '[data-try-prev]');
          if (btn) btn.click();
          return;
        }
        const live = liveTags();
        if (!live.length) return;
        const i = live.findIndex((t) => t.classList.contains('is-active'));
        live[((i < 0 ? 0 : i) + dir + live.length) % live.length].click();
      };
      drawer.querySelector('[data-m-prev]').addEventListener('click', () => stepFeature(-1));
      drawer.querySelector('[data-m-next]').addEventListener('click', () => stepFeature(1));

      /* 5. 右邊界拖動調整寬度 */
      let rs = null;
      grip.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        rs = { x: e.clientX, w: drawer.getBoundingClientRect().width };
        drawer.classList.add('is-resizing');
        grip.setPointerCapture(e.pointerId);
      });
      grip.addEventListener('pointermove', (e) => {
        if (!rs) return;
        const w = Math.max(150, Math.min(window.innerWidth, rs.w + (e.clientX - rs.x)));
        drawer.style.setProperty('--mdrawer-w', w + 'px');
      });
      const endRs = () => { if (rs) { drawer.classList.remove('is-resizing'); rs = null; } };
      grip.addEventListener('pointerup', endRs);
      grip.addEventListener('pointercancel', endRs);

      /* 6. 圖片水平拖動；拖到底再拖 → 換頁。雙指／雙擊縮放（只縮放 PDF） */
      const pageBtns = {
        prev: root.querySelector('[data-part3-fx-prev]') || root.querySelector('[data-try-prev]'),
        next: root.querySelector('[data-part3-fx-next]') || root.querySelector('[data-try-next]')
      };
      let drag = null, over = 0, lastTap = 0;
      const pts = new Map();
      let pinch = null;
      doc.addEventListener('pointerdown', (e) => {
        pts.set(e.pointerId, e);
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), z: zoom };
          drag = null;
          return;
        }
        drag = { x: e.clientX, sl: doc.scrollLeft }; over = 0;
      });
      doc.addEventListener('pointermove', (e) => {
        if (pts.has(e.pointerId)) pts.set(e.pointerId, e);
        if (pinch && pts.size === 2) {
          const [a, b] = [...pts.values()];
          setZoom(pinch.z * (Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / pinch.d));
          return;
        }
        if (!drag) return;
        const max = doc.scrollWidth - doc.clientWidth;
        const t = drag.sl - (e.clientX - drag.x);
        doc.scrollLeft = Math.max(0, Math.min(max, t));
        over = t < 0 ? t : (t > max ? t - max : 0);
        edgeL.classList.toggle('is-on', over < -52);
        edgeR.classList.toggle('is-on', over > 52);
      });
      const endDrag = (e) => {
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch = null;
        if (!drag) return;
        if (over > 52 && pageBtns.next) pageBtns.next.click();
        else if (over < -52 && pageBtns.prev) pageBtns.prev.click();
        edgeL.classList.remove('is-on'); edgeR.classList.remove('is-on');
        drag = null; over = 0;
      };
      doc.addEventListener('pointerup', endDrag);
      doc.addEventListener('pointercancel', endDrag);
      doc.addEventListener('click', () => {
        const now = Date.now();
        if (drawer.classList.contains('is-full') && now - lastTap < 320) setZoom(zoom > 1 ? 1 : 2);
        lastTap = now;
      });
      doc.addEventListener('wheel', (e) => {
        if (!drawer.classList.contains('is-full')) return;
        if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zoom - e.deltaY * 0.004); }
      }, { passive: false });

      /* 7. 只有捲到這一節時才顯示拉手 */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            root.classList.toggle('is-inview', en.isIntersecting);
            puller.classList.toggle('is-on', en.isIntersecting);
            if (!en.isIntersecting) setOpen(false);
          });
        }, { rootMargin: '-10% 0px -10% 0px' }).observe(root);
      } else {
        root.classList.add('is-inview');
        puller.classList.add('is-on');
      }
      /* Esc 或按到遮罩以外的情況也要關得掉 */
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    });
};
initMobileDocDrawers();


/* ---------------------------------------------------------------------------
   手機版：試一試（11）
   桌面版是左右並排（史料｜闖關面板）。手機版改成「整節剛好一個螢幕高」，
   由上而下：進度列 → 視窗 → 引導對話框；只有視窗內部會捲動。
   視窗內容依階段切換：
     第一步（下載）   PDF ＋ 底部一條細長列（檔名／下載／已下載）
     第二步（作答中） 只顯示 PDF（跟著題目換標示圖），不再逐句堆疊已答的 prompt
     第二步（完成）   改顯示累積的全部 prompt，可複製
     第三步（比對）   顯示比對區
   作法：把既有的史料欄與 stage 一起搬進一個新的 .mtry-win 外框；
   兩者都是穩定節點（stage 只有內容會被重繪，元素本身不變），搬動不影響既有邏輯。
   桌面版會把它們搬回原位，維持原本的 grid。
   --------------------------------------------------------------------------- */
const initMobileTryLayout = () => {
  const root = document.getElementById('part-3-try-explorer');
  if (!root) return;
  const doc = root.querySelector('.part3-try-doc');
  const scroll = root.querySelector('.part3-try-scroll');
  const todo = root.querySelector('[data-try-todo]');
  const stage = root.querySelector('[data-try-stage]');
  if (!doc || !scroll || !stage) return;

  const win = document.createElement('div');
  win.className = 'mtry-win';
  const bar = document.createElement('div');
  bar.className = 'mtry-winbar';
  bar.innerHTML = '<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="ttl"></span>';
  const titleEl = bar.querySelector('.ttl');

  let mobile = null;
  const toMobile = () => {
    if (mobile === true) return;
    mobile = true;
    win.appendChild(bar);
    win.appendChild(doc);
    win.appendChild(stage);
    scroll.appendChild(win);
    syncState();
  };
  const toDesktop = () => {
    if (mobile === false) return;
    mobile = false;
    root.insertBefore(doc, root.firstChild);   /* 史料欄回到 grid 第一欄 */
    scroll.appendChild(stage);                  /* stage 回到面板內 */
    if (win.parentNode) win.remove();
    root.classList.remove('is-mtry-p1', 'is-mtry-steps', 'is-mtry-overview', 'is-mtry-p3');
  };

  /* 由 stage 內容判斷目前階段，設定 root 上的狀態 class 與視窗標題 */
  const syncState = () => {
    if (mobile !== true) return;
    const has = (s) => !!stage.querySelector(s);
    let state, title;
    if (has('[data-try-dl]')) { state = 'is-mtry-p1'; title = '第一步 · 下載史料'; }
    else if (has('[data-try-cmp]')) { state = 'is-mtry-p3'; title = '第三步 · 比較 OCR 結果'; }
    else if (has('.part3-try-chat.is-final')) { state = 'is-mtry-overview'; title = '第二步 · 完成的 Prompt'; }
    else if (has('[data-try-chat]')) { state = 'is-mtry-steps'; title = '第二步 · 撰寫給 Agentic AI 的 Prompt'; }
    else { state = 'is-mtry-steps'; title = '第二步 · 撰寫給 Agentic AI 的 Prompt'; }
    ['is-mtry-p1', 'is-mtry-steps', 'is-mtry-overview', 'is-mtry-p3']
      .forEach((cl) => root.classList.toggle(cl, cl === state));
    titleEl.textContent = title;
  };
  new MutationObserver(syncState).observe(stage, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['class']
  });

  const mq = window.matchMedia('(pointer: coarse) and (hover: none), (max-width: 1040px)');
  const apply = () => (mq.matches ? toMobile() : toDesktop());
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply);
};
initMobileTryLayout();
