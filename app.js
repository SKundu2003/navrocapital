// ============================================
// Navro Capital — Main Application JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWhatsAppLinks();
  initScheduleLinks();
  initClickToCopy();
  initScrollAnimations();
  initMarketInsight();
  initBondsTable();
  initStocksTable();
  initMutualFundsTable();
});

// ============================================
// Navbar
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ============================================
// WhatsApp Links
// ============================================
function initWhatsAppLinks() {
  const whatsappIds = [
    'heroWhatsapp', 'whatsappFloat', 'footerWhatsapp',
    'stickyWhatsapp', 'bondWhatsapp', 'stockWhatsapp',
    'mfWhatsapp', 'contactWhatsappCard'
  ];

  whatsappIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = CONFIG.contact.whatsappLink;
      el.target = '_blank';
      el.rel = 'noopener';
      el.addEventListener('click', (e) => {
        if (el.tagName === 'A') return; // Let link work naturally
      });
    }
  });
}

// ============================================
// Schedule Meeting Links
// ============================================
function initScheduleLinks() {
  // The Cal.com embed script in index.html automatically binds to [data-cal-link] elements.
  // We do NOT need to manually call window.Cal("modal", ...) on click, as that causes two modals to open
  // and breaks the scroll restoration when closed.

  // Per user request: "also after closing just do refresh"
  // We will listen for Cal.com's native close event and trigger a clean page refresh.
  if (window.Cal) {
    window.Cal("on", {
      action: "*",
      callback: (e) => {
        if (e.detail && (e.detail.action === 'link:close' || e.detail.action === 'close')) {
          location.reload();
        }
      }
    });

    window.addEventListener('message', (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const isCalEvent = e.origin.includes('cal.com') || (data && (data.origin === 'cal.com' || data.source === 'cal-embed'));
        if (isCalEvent && (data.action === 'link:close' || data.event === 'close' || data.type === 'cal:close')) {
          location.reload();
        }
      } catch (err) {}
    });
  }
}

// ============================================
// Click to Copy
// ============================================
function initClickToCopy() {
  const copyElements = document.querySelectorAll('[data-copy]');

  copyElements.forEach(el => {
    el.addEventListener('click', () => {
      const text = el.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${text}`);
      });
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ============================================
// Scroll Animations (IntersectionObserver)
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// Market Insight (Home Page)
// ============================================
function initMarketInsight() {
  const insightText = document.getElementById('insightText');
  const insightEditBtn = document.getElementById('insightEditBtn');
  const insightEditor = document.getElementById('insightEditor');
  const insightTextarea = document.getElementById('insightTextarea');
  const insightSave = document.getElementById('insightSave');
  const insightCancel = document.getElementById('insightCancel');

  if (!insightText) return;

  // Load insight text
  const savedInsight = localStorage.getItem(CONFIG.storageKeys.marketInsight);

  if (savedInsight) {
    insightText.textContent = savedInsight;
  } else {
    // Load from data.js
    if (window.NAVRO_DATA && window.NAVRO_DATA.marketInsight) {
      insightText.textContent = window.NAVRO_DATA.marketInsight;
    } else {
      insightText.textContent = 'Markets are showing resilience amid global uncertainty. Contact us for personalized insights.';
    }
  }

  // Admin mode
  const isAdmin = localStorage.getItem(CONFIG.storageKeys.isAdmin) === 'true';
  if (isAdmin && insightEditBtn) {
    insightEditBtn.classList.add('show');
  }

  if (insightEditBtn) {
    insightEditBtn.addEventListener('click', () => {
      insightTextarea.value = insightText.textContent;
      insightText.style.display = 'none';
      insightEditor.classList.add('active');
      insightEditBtn.style.display = 'none';
      insightTextarea.focus();
    });
  }

  if (insightSave) {
    insightSave.addEventListener('click', () => {
      const newText = insightTextarea.value.trim();
      if (newText) {
        insightText.textContent = newText;
        localStorage.setItem(CONFIG.storageKeys.marketInsight, newText);
        showToast('Market insight updated successfully');
      }
      insightText.style.display = '';
      insightEditor.classList.remove('active');
      insightEditBtn.style.display = '';
    });
  }

  if (insightCancel) {
    insightCancel.addEventListener('click', () => {
      insightText.style.display = '';
      insightEditor.classList.remove('active');
      insightEditBtn.style.display = '';
    });
  }
}

// ============================================
// Bonds Table
// ============================================
function initBondsTable() {
  const corporateGrid = document.getElementById('corporateBondsGrid');
  const stateGrid = document.getElementById('stateBondsGrid');

  if (!corporateGrid && !stateGrid) return;

  const data = window.NAVRO_DATA || {};
  
  if (corporateGrid && data.corporateBonds) {
    window._corporateBonds = data.corporateBonds;
    renderBondCards(data.corporateBonds, corporateGrid);
  }
  if (stateGrid && data.stateBonds) {
    renderBondCards(data.stateBonds, stateGrid);
  }
  updateBondCount();
  initBondFilters();
}

function renderBondCards(bonds, container) {
  container.innerHTML = bonds.map(bond => {
    const ratingClass = getRatingClass(bond.rating);
    const maturityFormatted = formatMaturity(bond.maturity);
    return `
      <div class="bond-card" data-issuance="${bond.issuance.toLowerCase()}" data-rating="${bond.rating.toLowerCase()}">
        <div class="bond-card-header">
          <span class="bond-card-number">#${bond.sno}</span>
          <span class="rating-badge ${ratingClass}">${bond.rating}</span>
        </div>
        <h3 class="bond-card-title">${bond.issuance}</h3>
        <div class="bond-card-stats">
          <div class="stat-item">
            <span class="stat-label">Coupon</span>
            <span class="stat-value">${bond.coupon}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Yield (YTM)</span>
            <span class="stat-value highlight">${bond.yield}</span>
          </div>
        </div>
        <div class="bond-card-footer">
          <div class="bond-maturity">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Maturity: ${maturityFormatted}
          </div>
          <a href="${CONFIG.contact.whatsappLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm btn-inquire">
            Inquire Now
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function getRatingClass(rating) {
  const r = rating.toUpperCase();
  if (r.includes('AA')) return 'aa';
  if (r.includes('A') && !r.includes('BBB')) return 'a';
  if (r.includes('BBB')) return 'bbb';
  return 'bb-below';
}

function formatMaturity(dateStr) {
  if (!dateStr) return '—';
  // Handle year-only (e.g., "2033")
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  // Parse ISO date
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function initBondFilters() {
  const searchInput = document.getElementById('bondSearch');
  const ratingFilter = document.getElementById('ratingFilter');

  if (searchInput) {
    searchInput.addEventListener('input', filterBonds);
  }
  if (ratingFilter) {
    ratingFilter.addEventListener('change', filterBonds);
  }
}

function filterBonds() {
  const searchTerm = (document.getElementById('bondSearch')?.value || '').toLowerCase();
  const ratingValue = (document.getElementById('ratingFilter')?.value || '').toUpperCase();
  const grid = document.getElementById('corporateBondsGrid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.bond-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const issuance = card.getAttribute('data-issuance') || '';
    const rating = (card.getAttribute('data-rating') || '').toUpperCase();

    const matchesSearch = !searchTerm || issuance.includes(searchTerm);
    let matchesRating = true;

    if (ratingValue) {
      if (ratingValue === 'AA') {
        matchesRating = rating.includes('AA');
      } else if (ratingValue === 'A') {
        matchesRating = (rating.includes('A') && !rating.includes('AA') && !rating.includes('BBB'));
      } else if (ratingValue === 'BBB') {
        matchesRating = rating.includes('BBB') && !rating.includes('BBB-');
      } else if (ratingValue === 'BB') {
        matchesRating = rating.includes('BBB-') || rating.includes('BB') || rating.includes('B ');
      }
    }

    const show = matchesSearch && matchesRating;
    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  updateBondCount(visibleCount);
}

function updateBondCount(count) {
  const countEl = document.getElementById('bondCount');
  if (!countEl) return;

  if (count === undefined) {
    const cards = document.getElementById('corporateBondsGrid')?.querySelectorAll('.bond-card');
    count = cards ? cards.length : 0;
  }

  countEl.textContent = `Showing ${count} bond${count !== 1 ? 's' : ''}`;
}

// ============================================
// Stocks Table
// ============================================
function initStocksTable() {
  const stocksBody = document.getElementById('stocksBody');
  if (!stocksBody) return;

  const data = window.NAVRO_DATA || {};
  if (data.stocks) {
    window._stocks = data.stocks;
    renderStockRows(data.stocks, stocksBody);
    updateStockCount(data.stocks.length);
    initStockSearch();
  }
}

function renderStockRows(stocks, tbody) {
  tbody.innerHTML = stocks.map((stock, i) => `
    <tr data-name="${stock.name.toLowerCase()}">
      <td>${i + 1}</td>
      <td style="font-weight: 600; color: var(--slate-900);">${stock.name}</td>
      <td style="font-weight: 600; color: var(--navy);">${stock.price}</td>
      <td>${stock.faceValue}</td>
      <td>
        <a href="${CONFIG.contact.whatsappLink}" target="_blank" rel="noopener" class="inquire-link">
          Inquire
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </td>
    </tr>
  `).join('');
}

function initStockSearch() {
  const searchInput = document.getElementById('stockSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const rows = document.getElementById('stocksBody').querySelectorAll('tr');
    let count = 0;
    rows.forEach(row => {
      const name = row.getAttribute('data-name') || '';
      const show = !term || name.includes(term);
      row.style.display = show ? '' : 'none';
      if (show) count++;
    });
    updateStockCount(count);
  });
}

function updateStockCount(count) {
  const el = document.getElementById('stockCount');
  if (el) {
    el.textContent = `Showing ${count} stock${count !== 1 ? 's' : ''}`;
  }
}

// ============================================
// Mutual Funds Table
// ============================================
function initMutualFundsTable() {
  const mfBodyMain = document.getElementById('mfBodyMain');
  const mfBodyReits = document.getElementById('mfBodyReits');
  if (!mfBodyMain || !mfBodyReits) return;

  const data = window.NAVRO_DATA || {};
  
  window._mfData = {
    equity: data.equityFunds || [],
    debt: data.debtFunds || [],
    commodity: data.commodityFunds || [],
    reits: data.reitsInvits || []
  };

  // Setup radio listeners
  const radios = document.querySelectorAll('input[name="mfType"]');
  radios.forEach(r => r.addEventListener('change', handleMFTypeChange));

  initMFFilters();

  // Initial render (equity is checked by default)
  handleMFTypeChange();
}

function handleMFTypeChange() {
  const selectedType = document.querySelector('input[name="mfType"]:checked').value;
  const funds = window._mfData[selectedType] || [];
  
  const tableMain = document.getElementById('mfTableMain');
  const tableReits = document.getElementById('mfTableReits');
  const tbodyMain = document.getElementById('mfBodyMain');
  const tbodyReits = document.getElementById('mfBodyReits');
  const categoryFilter = document.getElementById('mfCategoryFilter');
  const searchInput = document.getElementById('mfSearch');

  // Reset search & filter
  if (searchInput) searchInput.value = '';

  if (selectedType === 'reits') {
    tableMain.style.display = 'none';
    tableReits.style.display = '';
    renderMFReitsRows(funds, tbodyReits);
  } else {
    tableReits.style.display = 'none';
    tableMain.style.display = '';
    renderMFMainRows(funds, tbodyMain);
  }

  populateMFCategories(funds);
  updateMFCount(funds.length);
}

function renderMFMainRows(funds, tbody) {
  tbody.innerHTML = funds.map((mf, i) => {
    const return3y = mf.return3y > 0 ? `${mf.return3y.toFixed(2)}%` : '—';
    const return5y = mf.return5y > 0 ? `${mf.return5y.toFixed(2)}%` : '—';
    const aumFormatted = formatAUM(mf.aum);
    const return3yColor = mf.return3y > 15 ? 'var(--emerald-dark)' : (mf.return3y > 0 ? 'var(--navy)' : (mf.return3y === 0 ? 'var(--slate-500)' : 'var(--red)'));
    const return5yColor = mf.return5y > 15 ? 'var(--emerald-dark)' : (mf.return5y > 0 ? 'var(--navy)' : (mf.return5y === 0 ? 'var(--slate-500)' : 'var(--red)'));

    return `
      <tr data-name="${mf.name.toLowerCase()}" data-category="${mf.category.toLowerCase()}">
        <td>${i + 1}</td>
        <td style="font-weight: 600; color: var(--slate-900); white-space: normal; min-width: 240px;">${mf.name}</td>
        <td><span class="mf-category-badge">${mf.category}</span></td>
        <td style="font-weight: 600; color: ${return3yColor};">${return3y}</td>
        <td style="font-weight: 600; color: ${return5yColor};">${return5y}</td>
        <td>${mf.expenseRatio}</td>
        <td style="white-space: nowrap;">${aumFormatted === '0 Cr' || aumFormatted === '0.00' ? '—' : '₹ ' + aumFormatted}</td>
        <td>
          <a href="${CONFIG.contact.whatsappLink}" target="_blank" rel="noopener" class="inquire-link">
            Enquire
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function renderMFReitsRows(funds, tbody) {
  tbody.innerHTML = funds.map((mf, i) => {
    return `
      <tr data-name="${mf.name.toLowerCase()}" data-category="${mf.category.toLowerCase()}">
        <td>${i + 1}</td>
        <td style="font-weight: 600; color: var(--slate-900); white-space: normal; min-width: 240px;">${mf.name}</td>
        <td><span class="mf-category-badge">${mf.category}</span></td>
        <td style="white-space: nowrap;">${mf.marketCap}</td>
        <td style="white-space: nowrap;">${mf.high52}</td>
        <td style="white-space: nowrap;">${mf.low52}</td>
        <td>${mf.roe}</td>
        <td>${mf.roce}</td>
        <td style="font-weight: 600; color: var(--emerald-dark);">${mf.yield}</td>
        <td>
          <a href="${CONFIG.contact.whatsappLink}" target="_blank" rel="noopener" class="inquire-link">
            Enquire
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function formatAUM(aum) {
  if (!aum) return '0.00';
  if (aum >= 100000) return (aum / 100).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ' Cr';
  return aum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function populateMFCategories(funds) {
  const select = document.getElementById('mfCategoryFilter');
  if (!select) return;
  
  select.innerHTML = '<option value="">All Categories</option>';
  const categories = [...new Set(funds.map(f => f.category))].sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.toLowerCase();
    option.textContent = cat;
    select.appendChild(option);
  });
}

function initMFFilters() {
  const searchInput = document.getElementById('mfSearch');
  const categoryFilter = document.getElementById('mfCategoryFilter');

  if (searchInput) searchInput.addEventListener('input', filterMFs);
  if (categoryFilter) categoryFilter.addEventListener('change', filterMFs);
}

function filterMFs() {
  const searchTerm = (document.getElementById('mfSearch')?.value || '').toLowerCase();
  const categoryValue = (document.getElementById('mfCategoryFilter')?.value || '').toLowerCase();
  
  const selectedType = document.querySelector('input[name="mfType"]:checked')?.value || 'equity';
  const tbody = selectedType === 'reits' ? document.getElementById('mfBodyReits') : document.getElementById('mfBodyMain');
  
  if (!tbody) return;

  const rows = tbody.querySelectorAll('tr');
  let count = 0;

  rows.forEach(row => {
    const name = row.getAttribute('data-name') || '';
    const category = row.getAttribute('data-category') || '';
    const matchesSearch = !searchTerm || name.includes(searchTerm) || category.includes(searchTerm);
    const matchesCategory = !categoryValue || category === categoryValue;
    const show = matchesSearch && matchesCategory;
    row.style.display = show ? '' : 'none';
    if (show) count++;
  });

  updateMFCount(count);
}

function updateMFCount(count) {
  const el = document.getElementById('mfCount');
  if (el) {
    el.textContent = `Showing ${count} fund${count !== 1 ? 's' : ''}`;
  }
}
