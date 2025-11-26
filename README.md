# Massachusetts Food Security & Sustainable Agriculture Directory

A modern, interactive web application for exploring farms, farmers markets, food access resources, and sustainable building solutions across Massachusetts and Rhode Island. This directory connects food security initiatives with sustainable agriculture infrastructure, including hempcrete suppliers, greenhouse builders, and solar installers.

## Features

### Core Directory
- **Interactive Marketplace**: Browse 40+ farms, markets, suppliers, and service providers
- **Advanced Filtering**: Filter by:
  - Business Type (farms, markets, suppliers, service providers, showcase projects)
  - Categories (hempcrete, greenhouse builders, solar installers, sustainable building)
  - Listing Tier (premium, featured, basic)
  - SNAP/HIP acceptance, Black-owned businesses, Environmental Justice zones
- **Search Functionality**: Search by business name, location, or activities
- **Map View**: Visualize business locations on an interactive map with OpenStreetMap
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Supplier Marketplace
- **Supplier Listings**: Hempcrete suppliers, greenhouse builders, solar installers, and agricultural services
- **Detailed Profiles**: Service areas, certifications, specialties, pricing tiers, and experience
- **Listing Tiers**: Premium (gold ring), Featured (blue ring), and Basic listings with priority display
- **Verified Badges**: Verified supplier indicators for trusted businesses

### Showcase Projects
- **Solar Roots Tiny Greenhouse**: Featured off-grid passive solar greenhouse design
  - 30cm hempcrete north wall (R-4.0 insulation)
  - 800W rooftop solar PV with 4.8kWh battery storage
  - Year-round growing capability in Zone 6a-6b
  - Open-source, community-replicable design
  - Budget: $12K-16K | Timeline: 6-8 weeks
- **Replicable Designs**: Open-source plans and community build support

### Business Features
- **Comprehensive Information**:
  - Contact details (phone, email, website)
  - Operating hours and seasons
  - Social media links
  - Supplier-specific data (certifications, service areas, specialties)
  - Showcase project details (budget, timeline, features)
- **AI-Powered Data Management**: Automated agents for data enrichment, verification, and discovery

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet & React-Leaflet
- **State Management**: React hooks (useState, useMemo)
- **AI Integration**: Claude API (Anthropic) for data enrichment
- **Backend API**: Express.js with TypeScript
- **Web Scraping**: Cheerio & Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/asiakay/Food_Security_MA.git
cd Food_Security_MA
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### AI Agents Setup (Optional)

To use the AI-powered data enrichment features:

1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Add your API key to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

4. Run the AI agents:
```bash
# Enrich missing data
npm run agent:enrich

# Verify existing data
npm run agent:verify

# Discover new markets
npm run agent:discover
```

See [AI_AGENTS_GUIDE.md](./AI_AGENTS_GUIDE.md) for detailed documentation.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Food_Security_MA/
├── src/
│   ├── components/
│   │   ├── BusinessCard.tsx      # Individual business card component
│   │   ├── FilterPanel.tsx       # Search and filter controls
│   │   └── MapView.tsx           # Interactive map component
│   ├── data/
│   │   └── businesses.json       # Business directory data
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   ├── types.ts                  # TypeScript type definitions
│   └── index.css                 # Global styles
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.ts                # Vite configuration
```

## Data Structure

Each business in the directory contains the following information:

- **Basic Info**: Name, location, activities
- **Contact**: Website, phone, email, social media
- **Operations**: Hours, season, indoor/outdoor type
- **Accessibility**: SNAP/HIP acceptance, vendor information
- **Community Impact**: Black-owned status, Environmental Justice zone
- **Location**: Latitude and longitude coordinates for mapping

## Key Features Explained

### Filtering System

The application provides multiple filter options:

- **Search Bar**: Full-text search across business names, locations, and activities
- **SNAP/HIP Filter**: Find businesses that accept SNAP and HIP benefits
- **Black-Owned Filter**: Highlight Black-owned or Black-led businesses
- **EJ Zone Filter**: Find businesses located in Environmental Justice zones
- **Location Type**: Filter by Indoor, Outdoor, or Hybrid locations

### Map Integration

- Interactive map powered by Leaflet and OpenStreetMap
- Click on markers to view business details in a popup
- Navigate between List View and Map View
- Click "Map" button on any business card to jump to its location on the map

### Responsive Design

The application is fully responsive and works on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (< 768px)

## Contributing

To add or update business information:

1. Edit `src/data/businesses.json`
2. Follow the existing data structure
3. Ensure all required fields are populated
4. Test the application locally
5. Submit a pull request

## Environmental Justice Focus

This directory prioritizes businesses in Environmental Justice (EJ) zones, which are communities that experience disproportionate environmental burdens. The EJ zone designation helps users identify food access resources in communities that need them most.

## SNAP/HIP Information

Many businesses in this directory accept SNAP (Supplemental Nutrition Assistance Program) and HIP (Healthy Incentives Program) benefits, making fresh, local food more accessible to all community members.

## Supplier Marketplace Revenue Model

This directory implements a tiered marketplace model:

### Listing Tiers
- **Premium ($200-500/month)**: Gold ring highlight, top placement, featured badge, verified status
- **Featured ($50-300/month)**: Blue ring highlight, priority placement, verified status
- **Basic (Free)**: Standard listing with all core features

### Revenue Streams
1. Supplier listing fees
2. Featured placements
3. Lead generation (5-10% commission on projects)
4. Advertising opportunities
5. Affiliate commissions (materials/services)
6. Premium analytics for suppliers

**Projected Year 1 Revenue**: $25K-60K with 10-20 active suppliers

See [GREENHOUSE_ROI_ANALYSIS.md](./GREENHOUSE_ROI_ANALYSIS.md) for detailed financial projections.

## Future Enhancements

Potential future features include:
- Lead generation and tracking system
- Supplier quote request forms
- User reviews and ratings
- Calendar integration for seasonal markets
- Mobile app version
- Admin panel for suppliers to update their information
- Advanced routing and directions
- Multi-language support
- Accessibility improvements (WCAG AAA compliance)

## License

This project is open source and available under the MIT License.

## Contact

For questions, suggestions, or to report issues, please open an issue on GitHub or contact the project maintainers.

## Acknowledgments

- Data compiled from local farmers markets, urban farms, and community organizations
- Built to support food security and environmental justice in Massachusetts and Rhode Island
- Special thanks to all the farmers, market organizers, and community leaders working to improve food access

---

**Note**: Business information is subject to change. Please contact businesses directly to confirm hours, locations, and availability before visiting.
