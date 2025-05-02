# Altın Günü App

A React application for organizing and managing traditional Turkish-style gold-day events ("altın günü"). Users can create groups, draw lots to determine contribution order, and track scheduled contributions in gold, cash (TRY, USD), or any preferred format.

## Features

- Create multiple gold-day groups
- Add participants to each group
- Draw lots to set the contribution order
- Track monthly contributions
- Support for different contribution types (gold, cash, custom)
- State management with Redux Toolkit
- Group-based organization for all data

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- TailwindCSS
- LocalStorage (for initial persistence)

## Installation

```bash
git clone https://github.com/yourusername/altin-gunu-app.git
cd altin-gunu-app
npm install
npm start
```

## Project Structure
src/
├── app/
│ └── store.ts
├── components/
│ ├── DayTypeSelector.tsx
│ ├── DrawOrder.tsx
│ ├── GroupsList.tsx
│ ├── History.tsx
│ ├── ParticipantsList.tsx
│ └── ScheduleList.tsx
├── features/
│ ├── dayTypes/
│ │ └── dayTypesSlice.ts
│ ├── groups/
│ │ └── groupsSlice.ts
│ ├── history/
│ │ └── historySlice.ts
│ ├── participants/
│ │ └── participantsSlice.ts
│ └── schedules/
│ └── schedulesSlice.ts
├── view/
│ ├── GroupDetailView.tsx
│ └── GroupsView.tsx
└── App.tsx