# OmniTrack - Incremental Changelog

This document tracks all the architectural and feature changes performed iteratively during the OmniTrack project lifecycle, from foundational UI setup to the data-driven analytics engine.

## Increment 1 & 2: Foundation & Dynamic Mapping
**Focus:** Project Bootstrap & Interactive Web GIS
- Initialized the Next.js 15+ frontend utilizing Tailwind CSS for premium, modern aesthetics.
- Built the foundational App Shell (Sidebar, Header, Main layout).
- Configured dynamic `Leaflet.js` to render a real-time global map.
- Setup simulated GPS point injection to begin moving markers without backend connections.
- Designed dynamic theme support (Dark/Light mode).

## Increment 3: Real Database & API Logic Layer
**Focus:** Full-Stack Architecture & ORM Integration
- Transitioned from mock data to a responsive full-stack architecture using a local **SQLite** database.
- Integrated **Prisma ORM**. Created the `Asset` and `LocationHistory` relational models.
- Established Next.js API Routes (`/api/assets`) and sync endpoints.
- Connected the `useLiveAssets` React Query hook to pull real database records for the dashboard metrics (Active Shipments, Avg Speed, Alerts).
- Solved dynamic routing and background polling synchronization mechanisms.

## Increment 4 & 5: Fleet Management & Telemetry Drill-Down
**Focus:** Global Fleet Table & Historical Analysis
- Transitioned the app from a visual map into a robust logistical management interface by creating the `/assets` management page.
- Implemented an interactive Data Table supporting deep filtering, categorization, and sorting of all tracked assets.
- Built the `AssetDetailPanel` drawer component allowing administrators to click into a single operation.
- Enabled Telemetry Drill-Downs inside the drawer to view chronological positional history strings.
- Fixed complex hydration mismatches caused by Next Themes and Client components.

## Increment 6: Lifecycle Management (CRUD)
**Focus:** Asset Provisioning and Decommissioning
- Transformed the platform into a read/write tool by enabling full lifecycle administration.
- Engineered the `POST /api/assets` endpoint to randomize logical starting coordinates and insert new shipping assets.
- Built the `DELETE /api/assets/[id]` endpoint to cascade-remove assets and their related location histories.
- Developed the `ProvisionAssetModal.tsx` for clean user input and categorization (Ship, Truck, Plane).
- Connected the deletion mechanics into the Details Panel with a safety/confirmation UI loop.
- Tied mutations back into `React Query` to ensure the dashboard reflects additions/removals immediately across all synchronized peers.

## Increment 7: Global Fleet Analytics & Statistical Dashboards 
**Focus:** Data Visualization & Geographic Intelligence (Geofencing)
- Added the `recharts` SVG charting library as an application dependency.
- Constructed a new `/analytics` central hub with dedicated routing.
- Designed the **Fleet Distribution Chart** to visualize real-time breakdowns of asset status and physical vehicle types dynamically.
- Developed an **Efficiency Trends Chart**, projecting real-time velocity arrays against overall active operation density as moving timeline data.
- Built the **Geofence Alerts Panel**, a live rules-engine UI that loops through operating assets globally and raises priority security/safety warnings if an asset enters hazardous latitudinal zones (like the poles) or slows down critically in active lanes.

## Increment 8: Application Settings & Global State
**Focus:** User configuration via Zustand Store
- Abstracted hardcoded map boundaries and simulation timings out of complex React components.
- Integrated the **Zustand** state-management library connected to browser `localStorage` as `omnitrack-settings`.
- Established a persistent `useSettingsStore` to distribute application parameters synchronously.
- Built a sophisticated `/settings` dashboard capable of real-time mutations with visual interactive sliders.
- Connected the `useLiveAssets` React Query fetch-loop to the global store, allowing users to forcefully choke or accelerate API network traffic.
- Connected the `GeofenceAlertsPanel` warning thresholds to the Global State, allowing administrators to expand or contract hazardous operational tracking borders live.

## Increment 9: Interactive Dedicated Live Map
**Focus:** Full-Screen Geospatial Visualization
- Designed a new `/map` application route presenting an immersive, full-height geospatial dashboard.
- Engineered `InteractiveLiveMap.tsx`, a specialized wrapper for `react-leaflet` that watches state props and natively executes high-performance Map UI routines (`useMap().flyTo()`) out of the React rendering pipeline.
- Added Theme-Aware Mapping: The base CARTO map tiles dynamically pivot from "Voyager" (Light Mode) to "Dark Matter" (Dark Mode) based on your system configuration.
- Crafted `AssetFlyoutList.tsx`, replacing raw text fields with intuitive UI cards acting as an operational directory, enabling one-click "fly-to" logic for instantaneous asset tracking across the globe.

## Increment 10: Authentication & Secure Data Engine
**Focus:** Platform Security and Administrative Reset Functions
- Completely overhauled Application Security utilizing the bleeding-edge **Auth.js (`next-auth@beta`)**.
- Protected all proprietary logistics dashboards via Edge-compatible **Next.js Middleware**, aggressively enforcing authentication routing to a newly designed `/login` interface.
- Expanded the Database schema utilizing Prisma's powerful relational engines to forge a localized `User` system complete with strict Role-based access control and `bcrypt-ts` password hashing capabilities.
- Developed an explosive **Danger Zone** configuration tool inside the Settings interface communicating natively with a restricted `/api/admin/reset` endpoint.
- Empowered system Administrators with the ability to instantly purge all historical trajectory arrays and live telemetry streams—subsequently rebuilding the map's original seed conditions globally with a single click.

## Increment 11: Final Project Rebranding & Organizational Cleanup
**Focus:** Brand Alignment and Routing Architecture Reorganization
- Formally renamed the repository and project directory to **OmniTrack** for consistent professional branding.
- Reorganized the core application routes into a unified `(dashboard)` route group, enhancing code maintainability and ensuring consistent authentication guard coverage.
- Optimized the file structure by consolidating all application logic within the `web-app` context.
- Finalized environment configurations to support seamless local development and deployment.
