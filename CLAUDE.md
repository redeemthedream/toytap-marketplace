# ToyTap Marketplace - Project Context

## Overview
Consumer-facing toy marketplace website rebuilt from Softr to standalone HTML/CSS/JS. Deployed on Vercel.

## Live Site
- **URL**: https://toytap-marketplace.vercel.app/
- **GitHub**: https://github.com/redeemthedream/toytap-marketplace

## API Configuration
- **Base URL**: `https://hub.gettoytap.com`
- **Supabase**: `https://ehuwltjozobbbzsdygbo.supabase.co` (for watchlist/auth)

## Key Endpoints
| Endpoint | Purpose |
|----------|---------|
| `/toys/leaderboard?limit=100` | Get ranked toys |
| `/toys/category/{cat}?sort={sort}&limit=100` | Toys by category |
| `/toys/category/{cat}/{sub}?sort={sort}&limit=100` | Toys by subcategory |
| `/toys/age/{age}?sort={sort}&limit=100` | Toys by age group |
| `/toys/brand/{brand}?sort={sort}&limit=50` | Toys by brand |
| `/toys/{asin}/price-history` | Price history data (includes tt_grade, tt_grade_score, toy_tap_rank_global) |
| `/toys/search?q={query}` | Search toys |
| `/feature/{slug}` | Blog post data |

## File Structure
```
D:\toytap-marketplace\
├── index.html        # Homepage with 3 filter tabs + modal popup
├── rankings.html     # Best Toys / Best Value leaderboard
├── categories.html   # 11 categories + 5 age groups
├── brands.html       # Brand browser with 5 filter tabs
├── blog.html         # Blog index with filters
├── post.html         # Individual blog post template
├── watchlist.html    # User watchlist (Supabase auth)
├── login.html        # Authentication page (magic link + Google)
├── toy.html          # Toy detail page with price history charts
├── css/
│   └── styles.css    # Shared styles
├── js/
│   └── api.js        # Shared API utilities
└── CLAUDE.md         # This file
```

## Design System

### Tailwind Colors (configured in each HTML)
```javascript
primary: "#3fc3d5"      // Cyan accent
background-dark: "#0a0e27"  // Navy background
navy-deep: "#0a0e27"
navy-card: "#12183d"    // Card background
```

### Gradient Logo
```html
<span class="bg-gradient-to-r from-primary via-white to-yellow-400 bg-clip-text text-transparent">Toy Tap</span>
```

### Animated Gradient (index.html)
```css
.gradient-animate {
    background: linear-gradient(90deg, #3fc3d5, #a855f7, #f59e0b, #3fc3d5);
    background-size: 300% 100%;
    animation: gradient-shift 4s ease infinite;
}
```

### Glass Panel Effect
```css
.glass-panel {
    background: rgba(18, 24, 61, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(63, 195, 213, 0.1);
}
```

## Homepage Filter Tabs (index.html)
| Tab | Filter Logic | Sort |
|-----|--------------|------|
| Hot Now | Fresh deals (updated <48hrs + discount > 0) | By recency |
| Biggest % Off | All deals with discount > 0 | By discount % |
| Lowest Ever | is_lowest_price_ever = true | By price (lowest first) |

## Brands Page Filter Tabs (brands.html)
| Tab | Filter Logic | Sort |
|-----|--------------|------|
| Hot Now | Fresh deals (<48hrs + discount) | By recency |
| Toy Tap Picks | TT Grade S, A+, or A | By grade |
| Best Sellers | All toys | By review count |
| Price Drops | Discount > 5% | By discount % |
| Top Rated | Rating >= 4.5 + 50+ reviews | By rating |

## Rankings Page Tabs (rankings.html)
| Tab | Metric | Sort |
|-----|--------|------|
| Best Toys | TT Grade | By tt_grade_score |
| Best Value | TT Score | By toy_tap_score |

## Tracked Brands (17 total)
Melissa & Doug, Learning Resources, VTech, LEGO, Play-Doh, Green Toys, LeapFrog, Fisher-Price, PicassoTiles, Hape, Skillmatics, KidKraft, Little Tikes, BRIO, Step2, MAGNA-TILES, Infantino

## Authentication (Supabase)
- Magic link email (via Resend SMTP)
- Google OAuth
- User data upserted to `public.users` table on sign-in
- Watchlist stored in localStorage per user ID

## Modal Popup System (index.html)
- Click toy card → opens modal with preview
- Modal shows: image, brand, name, price, discount, rating, reviews
- "Buy on Amazon" button (affiliate link)
- "View Price History" button (requires login)
- Non-authenticated users see login prompt in modal

## Key Functions (js/api.js)
- `fetchLeaderboard(limit)` - Get top toys
- `fetchByCategory(cat, sub, sort, limit)` - Get toys by category
- `fetchByAge(age, sort, limit)` - Get toys by age
- `fetchByBrand(brand, sort, limit)` - Get toys by brand
- `fetchPriceHistory(asin)` - Get price history
- `renderToyCard(toy, options)` - Render toy card HTML
- `openToyModal(asin)` - Open toy detail modal
- `getGradeClass(grade)` - Get CSS class for grade
- `getFreshnessInfo(updatedAt)` - Get freshness badge info

## Fresh Deal Logic
```javascript
function isFreshDeal(toy) {
    if (!toy.updated_at) return false;
    const date = new Date(toy.updated_at);
    const now = new Date();
    const hoursAgo = (now - date) / (1000 * 60 * 60);
    return hoursAgo < 48 && toy.discount_percent && parseFloat(toy.discount_percent) > 0;
}
```

## Deployment
- Auto-deploys from GitHub `main` branch to Vercel
- Backend API on Render (hub.gettoytap.com)
- CORS configured for *.vercel.app, *.netlify.app, *.softr.io

## Recent Updates (Jan 2026)
1. Migrated from Netlify to Vercel
2. Added CORS support for Vercel domains in backend
3. Fixed tab filtering to show distinct results per tab
4. Added animated gradient to "Best Prices" headline and logo (6s animation)
5. Added modal popup for toy preview with buy button
6. Added account gate - require login for price history
7. Fixed TT Grade not showing on toy detail page
8. Increased image sizes on rankings page
9. Set up Resend SMTP for auth emails with branded templates
10. Changed brand selector to simple glass cards with colored left border (LEGO blocks rejected)
11. Enhanced price display showing current price, slashed previous price, and highest price
12. Added "Partner" link in navigation header (yellow, links to gettoytap.com for B2B)
13. Fixed sort dropdown visibility in dark mode (proper styling for options)
14. Added "Blog" link to navigation on all pages
15. Added live ticker on homepage showing recent deals with pulsing "LIVE" indicator
16. Connected blog.html to Supabase `blog_posts` table
17. Created post.html for individual blog post pages (fetches toys from api_endpoint)
18. Added trending toys section to blog page
19. Blog posts now show real toy images from API endpoints (not stock photos)

## Session Notes (Jan 15, 2026)
See you tomorrow! Current state:
- Blog fully working with Supabase blog_posts table
- Blog posts display real toy images fetched from their api_endpoint field
- Trending toys section shows 8 popular items on blog page
- Live ticker scrolling on homepage with recent deals
- All changes pushed to Vercel and live at dashboard.gettoytap.com

## Email Templates (Supabase)
Custom branded HTML templates for:
- Confirm Sign Up
- Magic Link
- Change Email
- Reset Password

All use Toy Tap branding with dark navy/cyan theme.

## Navigation Header
All pages include these nav links:
- Home → index.html
- Rankings → rankings.html
- Brands → brands.html
- Blog → blog.html
- Watchlist → watchlist.html
- Partner → https://gettoytap.com (external, B2B sales page, yellow color)

## Blog System
- **blog.html** - Lists posts from Supabase `blog_posts` table with category filter pills
- **post.html** - Individual post page, fetches toys from post's `api_endpoint` field
- Posts show real toy images (first toy from API endpoint)
- Trending toys section shows 8 items from leaderboard

### blog_posts table columns:
- id, title, slug, category, intro_text, api_endpoint
- filter_max_price, filter_min_rating, filter_lowest_ever, sort_by
- additional_content, created_at, updated_at

## Toy Card Price Display
Shows up to 3 prices on each card:
- Current price (large, white)
- Previous/compare price (strikethrough, if different from current)
- Highest recorded price (small, if higher than current)

## Mobile Performance Optimizations (Jan 25, 2026)

### Issues Fixed
- Site was slow on mobile (initial load + interactions)
- Login was slow and auth state not updating properly after Google OAuth

### Optimizations Applied

**Font Loading:**
- Reduced Google Fonts Inter weights from 5 → 3 (400, 600, 700)
- Added `display=swap` to prevent invisible text during load

**Image Loading:**
- Added `loading="lazy" decoding="async"` to toy card images
- Images load on-demand as user scrolls

**API Optimization:**
- Reduced initial leaderboard fetch from 200 → 50 toys (index.html)
- Watchlist uses concurrent request limiter (max 3 parallel API calls)

**CSS Performance:**
- Background blur elements (`blur-[120px]`) set to `display: none` on mobile
- Gradient animations disabled on mobile
- Ticker animation disabled on mobile for smoother scrolling

**Preload Hints:**
- Added `<link rel="preconnect">` for CDNs (fonts, jsdelivr, supabase)
- Added `<link rel="preload">` for Supabase SDK

### Concurrent Request Limiter (watchlist.html)
```javascript
async function limitConcurrency(tasks, limit = 3) {
    const results = [];
    const executing = [];
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        if (tasks.length >= limit) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.all(results);
}
```

## Authentication Handling

### Auth State Listener (all pages)
All pages now have `onAuthStateChange` listener for proper auth state detection after Google OAuth redirect:
```javascript
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && !currentUser) {
        currentUser = session.user;
        updateNavAuth();
    } else if (!session && currentUser) {
        currentUser = null;
        window.location.reload();
    }
});
```

### Global signOut Function
signOut must be attached to window for onclick access in dynamic HTML:
```javascript
window.signOut = async function() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}
```

### Nav Auth Visibility
`nav-auth` div must NOT have `hidden` class on mobile:
```html
<!-- CORRECT -->
<div id="nav-auth" class="flex items-center gap-2 md:gap-4">

<!-- WRONG - hides login on mobile -->
<div id="nav-auth" class="hidden md:flex items-center gap-2 md:gap-4">
```

## Stats Bar (index.html)
```
| 20,000+ | X | X% |
| Toys Tracked | Fresh Deals | Up To Off |
```
- **20,000+** - Static marketing number
- **Fresh Deals** - Real count of hot deals (updated <48hrs + on sale)
- **Up To X% Off** - Max discount found (more impressive than average)

## Known Issues / Future Work

### Google OAuth Branding
Google consent screen shows "Continue to ehuw...supabase.co" because OAuth callback goes through Supabase.
**Fix:** Supabase Pro ($25/mo) + Custom Domain (e.g., auth.gettoytap.com)
- Go to Supabase Dashboard → Settings → Custom Domains
- Update Google OAuth redirect URI to use custom domain

### Supabase Project
- Project ID: `ehuwltjozobbbzsdygbo`
- Need Pro plan on THIS project for custom domain
