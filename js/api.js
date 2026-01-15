/* Toy Tap Marketplace - Shared JavaScript Utilities */

const API_BASE = 'https://hub.gettoytap.com';
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

// Global toy cache for modals
window.toyCache = {};

// ==================== API HELPERS ====================

async function fetchToys(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function fetchLeaderboard(limit = 100) {
    const data = await fetchToys(`/toys/leaderboard?limit=${limit}`);
    return data.toys || data || [];
}

async function fetchByCategory(category, subcategory = null, sort = 'score', limit = 100) {
    const cat = encodeURIComponent(category);
    let data;
    if (subcategory) {
        const sub = encodeURIComponent(subcategory);
        data = await fetchToys(`/toys/category/${cat}/${sub}?sort=${sort}&limit=${limit}`);
    } else {
        data = await fetchToys(`/toys/category/${cat}?sort=${sort}&limit=${limit}`);
    }
    return data.toys || data || [];
}

async function fetchByAge(age, sort = 'score', limit = 100) {
    return fetchToys(`/toys/age/${age}?sort=${sort}&limit=${limit}`);
}

async function fetchByBrand(brand, sort = 'score', limit = 50) {
    const data = await fetchToys(`/toys/brand/${encodeURIComponent(brand)}?sort=${sort}&limit=${limit}`);
    return data.toys || data || [];
}

async function fetchPriceHistory(asin) {
    return fetchToys(`/toys/${asin}/price-history`);
}

async function fetchBlogPost(slug) {
    return fetchToys(`/feature/${slug}`);
}

async function trackBlogView(slug) {
    try {
        await fetch(`${API_BASE}/feature/${slug}/view`, { method: 'POST' });
    } catch (e) {}
}

async function trackBlogClick(slug) {
    try {
        await fetch(`${API_BASE}/feature/${slug}/click`, { method: 'POST' });
    } catch (e) {}
}

// ==================== GRADE & SCORE HELPERS ====================

function getGradeClass(grade) {
    if (!grade) return 'grade-none';
    const g = grade.toUpperCase();
    if (g === 'S') return 'grade-s';
    if (g === 'A+') return 'grade-a-plus';
    if (g === 'A') return 'grade-a';
    if (g === 'B+') return 'grade-b-plus';
    if (g === 'B') return 'grade-b';
    if (g === 'C+') return 'grade-c-plus';
    if (g === 'C') return 'grade-c';
    if (g === 'D') return 'grade-d';
    return 'grade-none';
}

function renderGradeBadge(grade, size = '') {
    const gradeClass = getGradeClass(grade);
    const sizeClass = size ? `size-${size}` : '';
    return `<span class="tt-grade-badge ${sizeClass} ${gradeClass}">${grade || 'N/A'}</span>`;
}

function renderScoreBadge(score, size = 'lg') {
    const val = score ? parseFloat(score).toFixed(1) : 'N/A';
    return `<span class="tt-grade-badge size-${size}" style="background: linear-gradient(135deg, var(--yellow), #f59e0b); color: var(--navy);">${val}</span>`;
}

// ==================== PRICE HELPERS ====================

function formatPrice(value) {
    if (!value) return 'N/A';
    const num = parseFloat(value);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
}

function hasDeal(toy) {
    return toy.discount_percent && parseFloat(toy.discount_percent) > 0;
}

function getDiscountPercent(toy) {
    return toy.discount_percent ? parseFloat(toy.discount_percent).toFixed(0) : 0;
}

// ==================== FRESHNESS HELPERS ====================

function getFreshnessInfo(updatedAt) {
    if (!updatedAt) return { class: 'old', label: 'Unknown' };

    const now = new Date();
    const updated = new Date(updatedAt);
    const hoursAgo = (now - updated) / (1000 * 60 * 60);

    if (hoursAgo < 24) return { class: 'oneday', label: 'Today' };
    if (hoursAgo < 48) return { class: 'fresh', label: 'Fresh' };
    if (hoursAgo < 168) return { class: 'aging', label: 'This Week' };
    return { class: 'old', label: 'Older' };
}

function renderFreshnessBadge(updatedAt) {
    const info = getFreshnessInfo(updatedAt);
    return `
        <div class="freshness-badge-inline ${info.class}">
            <span class="freshness-label">${info.label}</span>
        </div>
    `;
}

// ==================== TOY CARD RENDERING ====================

function renderToyCard(toy, options = {}) {
    const {
        rank = null,
        showGrade = true,
        showScore = false,
        onClick = null,
        linkToDetail = true  // NEW: default to linking to detail page
    } = options;

    const imageUrl = toy.image_url_proxied || toy.image_url || PLACEHOLDER_IMG;
    const hasDiscount = hasDeal(toy);
    const discountPct = getDiscountPercent(toy);
    const isLowestEver = toy.is_lowest_price_ever || false;
    const freshness = getFreshnessInfo(toy.updated_at);

    // Cache for modal
    window.toyCache[toy.asin] = toy;

    // Rank display
    let rankDisplay = '';
    let rankClass = '';
    if (rank) {
        const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
        if (rank <= 3) {
            rankDisplay = `<div class="toy-card-rank top-3">${medals[rank]}</div>`;
            rankClass = `rank-${rank}`;
        } else {
            rankDisplay = `<div class="toy-card-rank">${rank}</div>`;
        }
    }

    // Metric badge
    let metricBadge = '';
    if (showScore) {
        metricBadge = renderScoreBadge(toy.toy_tap_score);
    } else if (showGrade) {
        metricBadge = renderGradeBadge(toy.tt_grade, 'lg');
    }

    // Click handler - default to detail page, or custom onClick
    const clickHandler = onClick || (linkToDetail ? `goToToyDetail('${toy.asin}')` : `openToyModal('${toy.asin}')`);

    // Deal badge (top left)
    const dealBadge = hasDiscount ? `<div class="toy-card-deal-badge">-${discountPct}%</div>` : '';

    // Lowest ever badge (top right, above freshness)
    const lowestBadge = isLowestEver ? `<div class="toy-card-lowest-badge">LOWEST EVER</div>` : '';

    // Freshness badge
    const freshnessBadge = `<div class="toy-card-freshness"><span class="freshness-pill ${freshness.class}">${freshness.label}</span></div>`;

    return `
        <div class="toy-card ${rankClass}" onclick="${clickHandler}">
            ${rankDisplay}
            ${dealBadge}
            ${lowestBadge}
            ${freshnessBadge}

            <div class="toy-card-image-wrap">
                <img src="${imageUrl}" alt="${toy.toy_name}" class="toy-card-image" onerror="this.src='${PLACEHOLDER_IMG}';">
                ${metricBadge ? `<div class="toy-card-metric">${metricBadge}</div>` : ''}
            </div>

            <div class="toy-card-content">
                <div class="toy-card-brand">${toy.brand || 'Brand'}</div>
                <div class="toy-card-name">${toy.toy_name}</div>
                <div class="toy-card-info">
                    <span>⭐ ${toy.rating || 'N/A'}</span>
                    <span>💬 ${(toy.reviews_count || 0).toLocaleString()}</span>
                </div>
                <div class="toy-card-price">
                    $${formatPrice(toy.price)}
                    ${hasDiscount ? `<span class="toy-card-original-price">$${formatPrice(toy.compare_price)}</span>` : ''}
                    ${hasDiscount ? `<span class="toy-card-deal">${discountPct}% off</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Navigate to toy detail page
function goToToyDetail(asin) {
    window.location.href = `toy.html?asin=${asin}`;
}

// ==================== MODAL ====================

function openToyModal(asin) {
    const toy = window.toyCache[asin];
    if (!toy) return;

    const imageUrl = toy.image_url_proxied || toy.image_url || PLACEHOLDER_IMG;
    const hasDiscount = hasDeal(toy);
    const discountPct = getDiscountPercent(toy);
    const grade = toy.tt_grade || 'N/A';
    const gradeClass = getGradeClass(grade);
    const score = toy.toy_tap_score ? parseFloat(toy.toy_tap_score).toFixed(1) : 'N/A';

    document.getElementById('modal-content-area').innerHTML = `
        <div class="modal-image-wrap">
            <img src="${imageUrl}" alt="${toy.toy_name}" class="modal-image" onerror="this.src='${PLACEHOLDER_IMG}';">
        </div>
        <div class="modal-content">
            <div class="modal-brand">${toy.brand || 'Unknown Brand'}</div>
            <h2 class="modal-name">${toy.toy_name}</h2>

            <div class="modal-metrics">
                <div class="modal-metric">
                    <div class="modal-metric-label">TT Grade</div>
                    <div class="modal-metric-value"><span class="tt-grade-badge size-sm ${gradeClass}">${grade}</span></div>
                </div>
                <div class="modal-metric">
                    <div class="modal-metric-label">TT Score</div>
                    <div class="modal-metric-value" style="color: var(--orange);">${score}</div>
                </div>
                <div class="modal-metric">
                    <div class="modal-metric-label">Rating</div>
                    <div class="modal-metric-value">${toy.rating || 'N/A'} ⭐</div>
                </div>
                <div class="modal-metric">
                    <div class="modal-metric-label">Reviews</div>
                    <div class="modal-metric-value">${(toy.reviews_count || 0).toLocaleString()}</div>
                </div>
            </div>

            <div class="modal-price-section">
                <span class="modal-price">$${formatPrice(toy.price)}</span>
                ${hasDiscount ? `<span class="modal-original-price">$${formatPrice(toy.compare_price)}</span>` : ''}
                ${hasDiscount ? `<div class="modal-savings">Save ${discountPct}%</div>` : ''}
            </div>

            <a href="${toy.affiliate_url || '#'}" target="_blank" class="modal-btn amazon">View on Amazon</a>
            <a href="toy.html?asin=${toy.asin}" class="modal-btn" style="background: var(--navy); color: #fff; margin-top: 10px;">View Full Details</a>
        </div>
    `;

    document.getElementById('toy-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeToyModal() {
    document.getElementById('toy-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click and escape key
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('toy-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeToyModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeToyModal();
    });
});

// ==================== NAVIGATION ====================

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function() {
            links.classList.toggle('open');
        });
    }
}

function setActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (path.endsWith(href) || (path === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ==================== LOADING STATE ====================

function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading toys...</p>
        </div>
    `;
}

function showError(container, message = 'Failed to load. Please try again.') {
    container.innerHTML = `
        <div class="loading">
            <p style="color: var(--red);">${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
    `;
}

// ==================== URL HELPERS ====================

function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    setActiveNav();
});

// Export for use in pages
window.Toy Tap = {
    API_BASE,
    PLACEHOLDER_IMG,
    fetchToys,
    fetchLeaderboard,
    fetchByCategory,
    fetchByAge,
    fetchByBrand,
    fetchPriceHistory,
    fetchBlogPost,
    trackBlogView,
    trackBlogClick,
    getGradeClass,
    renderGradeBadge,
    renderScoreBadge,
    formatPrice,
    hasDeal,
    getDiscountPercent,
    getFreshnessInfo,
    renderFreshnessBadge,
    renderToyCard,
    openToyModal,
    closeToyModal,
    showLoading,
    showError,
    getUrlParam
};
