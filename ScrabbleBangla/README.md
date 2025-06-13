# Bangla Scrabble - Multiplayer Word Game

A comprehensive multiplayer Bangla Scrabble game built with React, Express.js, and PostgreSQL featuring rigorous word validation with extensive juktakkhors (conjuncts).

## Features

- **Multiplayer Support**: Real-time gameplay for 2-4 players using WebSockets
- **Bangla Letters**: Comprehensive tile system with proper point values
- **Advanced Dictionary**: Over 500 Bangla words with complex conjunct validation
- **Interactive Board**: Drag-and-drop tile placement with premium squares
- **Turn Management**: Structured turn-based gameplay
- **Real-time Updates**: Live game state synchronization
- **PostgreSQL Database**: Persistent data storage

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL with Neon
- **Real-time**: WebSockets
- **Validation**: Zod schemas

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL=your_postgres_connection_string
```

3. Run the application:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Game Rules

- Form valid Bangla words using letter tiles
- Score points based on letter values and premium squares
- Players take turns placing tiles on the 15x15 board
- Game supports complex conjunct letters (juktakkhors)
- First player to use all tiles or highest score wins

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── lib/         # Utilities and game logic
│   │   └── pages/       # Application pages
├── server/              # Express backend
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes and WebSocket
│   └── storage.ts      # Data access layer
├── shared/              # Shared types and schemas
└── package.json
```

## Bangla Language Support

The game includes comprehensive support for:
- All Bangla vowels and consonants
- Complex conjunct letters (juktakkhors)
- Proper Unicode validation
- Rigorous spelling verification
- Cultural and modern vocabulary

## Development

The application uses modern development practices:
- TypeScript for type safety
- Drizzle ORM for database operations
- Real-time multiplayer with WebSockets
- Responsive design with Tailwind CSS
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.