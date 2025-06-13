import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTilePoints } from "@/lib/bangla-tiles";
import { useState } from "react";

interface GameBoardProps {
  board: (string | null)[];
  onTileDrop: (row: number, col: number) => void;
  onTileRemove: (row: number, col: number) => void;
  placedTiles?: { row: number; col: number; letter: string }[];
}

const BOARD_SIZE = 15;

// Premium square types and positions
const PREMIUM_SQUARES = {
  tripleWord: [
    0, 7, 14, 105, 119, 210, 217, 224,
    // Corner triple words and center positions
  ],
  doubleWord: [
    16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208,
  ],
  tripleLetter: [
    20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204,
  ],
  doubleLetter: [
    3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221,
  ],
};

function getPremiumSquareType(index: number): string | null {
  if (index === 112) return 'center'; // Center star
  if (PREMIUM_SQUARES.tripleWord.includes(index)) return 'triple-word';
  if (PREMIUM_SQUARES.doubleWord.includes(index)) return 'double-word';
  if (PREMIUM_SQUARES.tripleLetter.includes(index)) return 'triple-letter';
  if (PREMIUM_SQUARES.doubleLetter.includes(index)) return 'double-letter';
  return null;
}

function getPremiumSquareStyles(type: string | null) {
  switch (type) {
    case 'center':
      return 'bg-pink-500 text-white flex items-center justify-center font-bold text-lg';
    case 'triple-word':
      return 'bg-red-600 text-white text-xs flex items-center justify-center font-bold';
    case 'double-word':
      return 'bg-amber-500 text-white text-xs flex items-center justify-center font-bold';
    case 'triple-letter':
      return 'bg-purple-500 text-white text-xs flex items-center justify-center font-bold';
    case 'double-letter':
      return 'bg-blue-500 text-white text-xs flex items-center justify-center font-bold';
    default:
      return 'bg-slate-100';
  }
}

function getPremiumSquareText(type: string | null) {
  switch (type) {
    case 'center':
      return '★';
    case 'triple-word':
      return '3W';
    case 'double-word':
      return '2W';
    case 'triple-letter':
      return '3L';
    case 'double-letter':
      return '2L';
    default:
      return '';
  }
}

export function GameBoard({ board, onTileDrop, onTileRemove, placedTiles = [] }: GameBoardProps) {
  const [dragOverCell, setDragOverCell] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(index);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverCell(null);
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    onTileDrop(row, col);
  };

  const handleCellClick = (index: number) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    
    // If there's a temporarily placed tile, remove it
    const isTemporaryTile = placedTiles.some(tile => tile.row === row && tile.col === col);
    if (isTemporaryTile) {
      onTileRemove(row, col);
    }
  };

  const renderCell = (index: number) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const letter = board[index];
    const premiumType = getPremiumSquareType(index);
    const isTemporaryTile = placedTiles.some(tile => tile.row === row && tile.col === col);
    const temporaryTile = placedTiles.find(tile => tile.row === row && tile.col === col);

    const isDragOver = dragOverCell === index;
    const canDrop = !letter && !isTemporaryTile;

    let cellContent;
    
    if (temporaryTile) {
      // Temporarily placed tile (can be removed)
      cellContent = (
        <div className="bg-tile-bg border-2 border-tile-border rounded-sm w-full h-full flex items-center justify-center font-bangla font-semibold text-slate-900 cursor-pointer hover:bg-yellow-100 transition-colors">
          <div className="text-center">
            <div className="text-sm sm:text-lg">{temporaryTile.letter}</div>
            <div className="text-xs">{getTilePoints(temporaryTile.letter)}</div>
          </div>
        </div>
      );
    } else if (letter) {
      // Permanently placed tile
      cellContent = (
        <div className="bg-tile-bg border-2 border-tile-border rounded-sm w-full h-full flex items-center justify-center font-bangla font-semibold text-slate-900">
          <div className="text-center">
            <div className="text-sm sm:text-lg">{letter}</div>
            <div className="text-xs">{getTilePoints(letter)}</div>
          </div>
        </div>
      );
    } else {
      // Empty cell with premium square styling
      const premiumStyles = getPremiumSquareStyles(premiumType);
      const premiumText = getPremiumSquareText(premiumType);
      
      cellContent = (
        <div className={`w-full h-full ${premiumStyles} ${isDragOver && canDrop ? 'ring-2 ring-blue-400 ring-inset' : ''}`}>
          {premiumText}
        </div>
      );
    }

    return (
      <div
        key={index}
        className="aspect-square min-h-4 sm:min-h-6 border border-slate-300 relative"
        onDragOver={canDrop ? (e) => handleDragOver(e, index) : undefined}
        onDragLeave={handleDragLeave}
        onDrop={canDrop ? (e) => handleDrop(e, index) : undefined}
        onClick={() => handleCellClick(index)}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <span>Game Board</span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-600">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded mr-1"></div>
              Triple Word
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded mr-1"></div>
              Double Word
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
              Letter Bonus
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-15 gap-0.5 bg-slate-300 p-1 sm:p-2 rounded-lg aspect-square max-w-2xl mx-auto">
          {Array.from({ length: 225 }, (_, index) => renderCell(index))}
        </div>
      </CardContent>
    </Card>
  );
}
