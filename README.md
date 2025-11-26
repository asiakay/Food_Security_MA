# Massachusetts Food Security Business Directory

A modern, interactive web application for exploring farms, farmers markets, and food access resources across Massachusetts and Rhode Island. This directory focuses on food security, environmental justice zones, and community-supported agriculture.

## Features

- **Interactive Directory**: Browse 32+ local farms, farmers markets, and food-related businesses
- **Advanced Filtering**: Filter by SNAP/HIP acceptance, Black-owned businesses, Environmental Justice zones, and location type
- **Search Functionality**: Search by business name, location, or activities
- **Map View**: Visualize business locations on an interactive map with OpenStreetMap
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Business Details**: View comprehensive information including:
  - Contact information (phone, email, website)
  - Operating hours and seasons
  - Social media links
  - Vendor signup information
  - Location coordinates

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet & React-Leaflet
- **State Management**: React hooks (useState, useMemo)

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

## Future Enhancements

Potential future features include:
- User reviews and ratings
- Calendar integration for seasonal markets
- Mobile app version
- Admin panel for business owners to update their information
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
