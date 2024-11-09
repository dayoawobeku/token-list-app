# Crypto Token List

## Description

Crypto Token List is a web application that allows users to track and analyze
cryptocurrencies in real-time. Built with Next.js and React, it provides an
interactive and customizable interface for viewing cryptocurrency data.

## Features

- Real-time cryptocurrency data display
- Customizable table views
- Sorting functionality for columns
- Drag-and-drop functionality for column reordering
- Ability to save and switch between different views

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Tanstack Table
- dnd kit (for drag-and-drop functionality)
- React Query (for data fetching)
- Nino

## Getting Started

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/dayoawobeku/token-list-app.git
   ```

2. Navigate to the project directory:

   ```
   cd token-list-app
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Development Server

Run the development server:

```
npm run dev
```

or

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## Usage

- The main page displays a table of cryptocurrencies with various data points.
- Use the "Customize" button to open a dialog where you can select which columns
  to display and reorder them.
- Click on column headers to sort the table by that column.
- Use the view buttons above the table to switch between different saved views.
- Drag and drop column headers to reorder them.

## Acknowledgments

- Data provided by
  [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
