# ToyTap Marketplace - Project Context

## Overview
Consumer-facing toy marketplace website rebuilt from Softr to standalone HTML/CSS/JS. Deployed on Netlify.

## Live Site
- **URL**: https://taupe-druid-4dec45.netlify.app/
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
| `/toys/{asin}/price-history` | Price history data |
| `/feature/{slug}` | Blog post data |

## File Structure
```
D:\toytap-marketplace\
├── index.html        # Homepage (deals page with 6 filter tabs)
├── rankings.html     # Best Toys / Best Value leaderboard
├── categories.html   # 11 categories + 5 age groups
├── brands.html       # Brand browser with A-Z navigation
├── blog.html         # Blog index with filters
├── post.html         # Individual blog post template
├── watchlist.html    # User watchlist (Supabase auth)
├── price.html        # Price history with Chart.js graphs
├── css/
│   └── styles.css    # Shared styles
├── js/
│   ├── api.js        # Shared API utilities
│   └── auth.js       # Supabase auth helpers
└── netlify.toml      # Netlify deployment config
```

## Design System

### CSS Variables
```css
--navy: #194A7C
--cyan: #6DC3D5
--yellow: #FDB913
--navy-dark: #0F3557
--bg-dark: #0a0e1a
--bg-card: #111827
--amazon-orange: #ff9900
--walmart-blue: #0071ce
```

### TT Grade Colors
| Grade | Color |
|-------|-------|
| S | Purple (#a855f7) |
| A+ | Green (#22c55e) |
| A | Green (#22c55e) |
| B+ | Blue (#3b82f6) |
| B | Blue (#3b82f6) |
| C+ | Orange (#f97316) |
| C | Orange (#f97316) |
| D | Gray (#6b7280) |

### TAP FRESH Badges
| Age | Class | Label |
|-----|-------|-------|
| <6 hours | fresh | Fresh |
| <24 hours | oneday | 1 Day |
| <72 hours | aging | 2-3 Days |
| Older | old | Older |

## Homepage Filter Tabs
1. **Hot Now** - Recent toys with high scores
2. **ToyTap Picks** - Top TT Grade toys
3. **Best Sellers** - Highest review counts
4. **Price Drops** - Active discounts sorted by % off
5. **Top Rated** - Highest Amazon ratings
6. **Walmart Deals** - Walmart items with discounts

## Categories (11 total)
Building, Vehicles, Outdoor, Baby & Toddler, Educational, Pretend Play, Arts & Crafts, Games & Puzzles, Dolls & Plush, Electronics & Tech, Action & Figures

## Age Groups (5 total)
- Baby (0-12 months)
- Toddler (1-3 years)
- Preschool (3-5 years)
- Kids (5-7 years)
- Tweens (8-12 years)

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

## Deployment
- Auto-deploys from GitHub `main` branch
- Netlify handles HTTPS, CDN, and routing
- No build step required (static HTML/CSS/JS)
