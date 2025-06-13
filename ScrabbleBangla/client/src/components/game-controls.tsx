import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shuffle, SkipForward, RotateCcw } from "lucide-react";
import { GameState } from "@shared/schema";

interface GameControlsProps {
  gameState: GameState;
  currentPlayerId: number;
  onSubmitMove: () => void;
  onShuffleTiles: () => void;
  onSkipTurn: () => void;
  onResetBoard: () => void;
  canSubmitMove: boolean;
  pendingMove: boolean;
}

export function GameControls({
  gameState,
  currentPlayerId,
  onSubmitMove,
  onShuffleTiles,
  onSkipTurn,
  onResetBoard,
  canSubmitMove,
  pendingMove,
}: GameControlsProps) {
  const isMyTurn = gameState.game.currentPlayerId === currentPlayerId;
  const gameActive = gameState.game.status === "active";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={onSubmitMove}
            disabled={!canSubmitMove || !isMyTurn || !gameActive || pendingMove}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Submit Move
          </Button>
          
          <Button
            onClick={onShuffleTiles}
            disabled={!isMyTurn || !gameActive}
            variant="outline"
            className="w-full"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle Tiles
          </Button>
          
          <Button
            onClick={onSkipTurn}
            disabled={!isMyTurn || !gameActive}
            variant="outline"
            className="w-full"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Turn
          </Button>
          
          <Button
            onClick={onResetBoard}
            disabled={!isMyTurn || !gameActive}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Board
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
