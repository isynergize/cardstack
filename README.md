# Learn Numbers - Multilingual Flashcard App

An interactive flashcard application for learning to count from 1 to 10 in 19 different languages. Built with React, TypeScript, and Motion.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)

## Features

- **19 Languages**: Hawaiian, Tahitian, Māori, Marquesan, French, German, Polish, Russian, Greek, Irish, Slovenian, Chinese, Vietnamese, Tagalog, Cebuano, Hebrew, Aramaic, English, Spanish
- **Interactive Cards**: Swipe left/right to navigate through cards
- **Flip Animation**: Tap cards to reveal the word and pronunciation
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Space, Escape)
- **Progress Persistence**: Your progress is saved locally per language
- **Off-Canvas Navigation**: Quick language switching via slide-out drawer
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: ARIA labels, keyboard navigation, reduced motion support
- **SEO Optimized**: Meta tags, Open Graph, structured data, sitemap, llms.txt

## Demo

[Live Demo](https://multilingual-numbers.examplefor.me/)

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cardstack.git
cd cardstack

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
cardstack/
├── public/
│   ├── data/                    # Language JSON files
│   │   ├── categories.json      # All languages grouped by region
│   │   ├── en.json              # English 1-10
│   │   ├── haw.json             # Hawaiian 1-10
│   │   └── ...                  # 19 language files
│   ├── robots.txt               # Crawler instructions
│   ├── sitemap.xml              # Site map
│   └── llms.txt                 # AI crawler info
├── src/
│   ├── api/                     # API client layer
│   │   ├── config.ts            # API configuration
│   │   ├── flashcards.ts        # Fetch functions + error handling
│   │   └── index.ts
│   ├── components/
│   │   ├── CardStack/           # Main flashcard stack
│   │   └── LanguageDrawer/      # Off-canvas navigation
│   ├── hooks/
│   │   ├── useCategories.ts     # Fetch language categories
│   │   ├── useFlashcards.ts     # Fetch cards for a language
│   │   ├── useKeyboard.ts       # Keyboard navigation
│   │   ├── useProgress.ts       # LocalStorage persistence
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main application
│   ├── App.css
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template + meta tags
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── vercel.json                  # Vercel deployment config
└── package.json
```

## Supported Languages

| Region | Languages |
|--------|-----------|
| **Pacific** | Hawaiian, Tahitian, Māori, Marquesan |
| **Europe** | French, German, Polish, Russian, Greek, Irish, Slovenian |
| **Asia** | Chinese, Vietnamese |
| **Philippines** | Tagalog, Cebuano |
| **Middle East** | Hebrew, Aramaic |
| **Global** | English, Spanish |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `A` | Previous card |
| `→` / `D` | Next card |
| `Space` / `Enter` | Flip card |
| `Escape` | Close drawer / Go back |

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript 5.6
- **Animation**: Motion (Framer Motion)
- **Build Tool**: Vite 7
- **Deployment**: Vercel
- **Styling**: CSS with CSS Variables

## API Reference

The app uses static JSON files served from `/data/`:

### Get Categories

```
GET /data/categories.json
```

Returns all languages grouped by region.

### Get Flashcards

```
GET /data/{langCode}.json
```

Returns flashcard data for a specific language.

**Example Response:**
```json
{
  "code": "haw",
  "name": "Hawaiian",
  "region": "Pacific",
  "cards": [
    {
      "number": 1,
      "word": "ʻekahi",
      "pronunciation": "eh-KAH-hee",
      "image": "/images/haw/1.jpg"
    }
  ]
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (automatic configuration via `vercel.json`)

### Manual Deployment

```bash
npm run build
# Upload contents of `dist/` to your hosting provider
```

## Configuration

### Domain Setup

Update these placeholder URLs before deployment:

- `index.html` - Update `https://multilingual-numbers.examplefor.me/` references
- `public/robots.txt` - Update sitemap URL
- `public/sitemap.xml` - Update all URLs
- `public/llms.txt` - Update domain reference

### API Base URL

Edit `src/api/config.ts` to change the API base URL:

```typescript
const config = {
  BASE_URL: '/data',  // Change for external API
  // ...
};
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-language`)
3. Commit your changes (`git commit -m 'Add Japanese language'`)
4. Push to the branch (`git push origin feature/new-language`)
5. Open a Pull Request

### Adding a New Language

1. Create a new JSON file in `public/data/{langCode}.json`:

```json
{
  "code": "ja",
  "name": "Japanese",
  "region": "Asia",
  "cards": [
    { "number": 1, "word": "一", "pronunciation": "ichi", "image": "/images/ja/1.jpg" },
    // ... cards 2-10
  ]
}
```

2. Add the language to `public/data/categories.json`
3. Update `public/sitemap.xml`
4. Update `public/llms.txt`

## SEO & Accessibility

### SEO Features
- Semantic HTML structure
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (WebApplication, EducationalOrganization)
- `robots.txt` with AI crawler directives
- `sitemap.xml` for all language pages
- `llms.txt` for AI/LLM crawlers

### Accessibility Features
- Keyboard-navigable interface
- ARIA labels and roles
- Focus management
- Skip link for main content
- Reduced motion support (`prefers-reduced-motion`)
- High contrast focus indicators

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Number translations verified against multiple linguistic sources
- Built with [Motion](https://motion.dev)
- Card stack interaction inspired by [Motion tutorials](https://motion.dev/tutorials/react-card-stack)

---

Made with care for language learners everywhere
