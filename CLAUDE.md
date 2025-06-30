# Howlin' Jorbo and the Zorkin Flonks Website

## Project Overview
A clean, minimal, dark website for musician Howlin' Jorbo and the Zorkin Flonks featuring an animated 4D hypercube built with React, Vite, and Three.js.

## Tech Stack
- React 18.3.1 with TypeScript
- Vite 6.0.1 for fast development and building
- Three.js with post-processing for 3D graphics
- Tailwind CSS v4 for styling

## Features
- **Animated 4D Hypercube**: Rotating tesseract with thick cylindrical wireframes
- **Post-Processing Effects**: UnrealBloom pass and 2-pixel camera blur
- **Clean Typography**: Text without drop shadows or dark overlays
- **Dark Theme**: Black background with golden wireframe colors
- **Responsive Design**: Works on all screen sizes

## Technical Implementation
- **4D Mathematics**: Real-time 4D rotation projected to 3D space
- **Cylinder Wireframes**: Thick glowing edges instead of thin lines
- **Bloom Rendering**: Enhanced glow effects on 3D geometry
- **Client-Side Rendering**: Proper hydration handling for Three.js

## Project Structure
```
/
├── src/
│   ├── components/
│   │   ├── HeroSection.tsx      # Hero section with text content
│   │   └── ThreeJSHero.tsx      # 4D hypercube with post-processing
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles with Tailwind CSS v4
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── postcss.config.mjs           # PostCSS configuration
```

## Commands
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Notes
- Converted from Next.js to React + Vite for simplified development
- Removed HeroUI dependency, replaced with vanilla CSS buttons
- All commented code and unused components removed
- Proper Three.js resource disposal in cleanup
- Cross-browser compatible cylinder wireframes
- Optimized post-processing pipeline
- ESLint configured to only lint src directory

**Note:** The site is only accessible while actively running the `npm run dev` command. The development server will go down when the command is terminated or times out.