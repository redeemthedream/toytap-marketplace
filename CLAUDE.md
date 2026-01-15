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
4. Added animated gradient to "Best Prices" headline
5. Added modal popup for toy preview with buy button
6. Added account gate - require login for price history
7. Fixed TT Grade not showing on toy detail page
8. Increased image sizes on rankings page
9. Set up Resend SMTP for auth emails with branded templates

## Email Templates (Supabase)
Custom branded HTML templates for:
- Confirm Sign Up
- Magic Link
- Change Email
- Reset Password

All use Toy Tap branding with dark navy/cyan theme.
