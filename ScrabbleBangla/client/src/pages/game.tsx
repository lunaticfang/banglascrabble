import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/game-header";
import { PlayersList } from "@/components/players-list";
import { GameBoard } from "@/components/game-board";
import { TileRack } from "@/components/tile-rack";
import { GameControls } from "@/components/game-controls";
import { useToast } from "@/hooks/use-toast";
import { gameWebSocket } from "@/lib/websocket";
import { isValidBanglaWord } from "@/lib/bangla-dictionary";
import { getTilePoints } from "@/lib/bangla-tiles";
import { apiRequest } from "@/lib/queryClient";
import { GameState, TileMove } from "@shared/schema";

interface GamePageProps {
  gameId: number;
  playerId: number;
}

export default function GamePage({ gameId, playerId }: GamePageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Game state
  const [draggedTile, setDraggedTile] = useState<{ letter: string; index: number } | null>(null);
  const [placedTiles, setPlacedTiles] = useState<TileMove[]>([]);
  const [previewWord, setPreviewWord] = useState<string>("");
  const [previewPoints, setPreviewPoints] = useState<number>(0);

  // Fetch game state
  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ['/api/games', gameId],
    refetchInterval: false,
  });

  // Mutations
  const submitMoveMutation = useMutation({
    mutationFn: async (moveData: { word: string; tiles: TileMove[]; score: number }) => {
      const response = await apiRequest("POST", `/api/games/${gameId}/moves`, moveData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Move submitted successfully!",
        description: `You scored ${previewPoints} points`,
      });
      setPlacedTiles([]);
      setPreviewWord("");
      setPreviewPoints(0);
      queryClient.invalidateQueries({ queryKey: ['/api/games', gameId] });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid move",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const skipTurnMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/games/${gameId}/skip`, { playerId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Turn skipped",
        description: "Moving to next player",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games', gameId] });
    },
  });

  // WebSocket connection
  useEffect(() => {
    gameWebSocket.joinGame(playerId, gameId);

    const handleGameStateUpdate = (data: any) => {
      queryClient.setQueryData(['/api/games', gameId], data.gameState);
    };

    const handleMoveSubmitted = (data: any) => {
      toast({
        title: "Move submitted",
        description: `${data.move.word} played for ${data.move.score} points`,
      });
      queryClient.setQueryData(['/api/games', gameId], data.gameState);
    };

    const handleTurnSkipped = (data: any) => {
      toast({
        title: "Turn skipped",
        description: "Moving to next player",
      });
      queryClient.setQueryData(['/api/games', gameId], data.gameState);
    };

    gameWebSocket.on('gameStateUpdate', handleGameStateUpdate);
    gameWebSocket.on('moveSubmitted', handleMoveSubmitted);
    gameWebSocket.on('turnSkipped', handleTurnSkipped);

    return () => {
      gameWebSocket.off('gameStateUpdate', handleGameStateUpdate);
      gameWebSocket.off('moveSubmitted', handleMoveSubmitted);
      gameWebSocket.off('turnSkipped', handleTurnSkipped);
      gameWebSocket.leaveGame();
    };
  }, [gameId, playerId, toast]);

  // Update preview when placed tiles change
  useEffect(() => {
    if (placedTiles.length > 0) {
      const word = placedTiles.map(tile => tile.letter).join('');
      const points = calculateMoveScore(placedTiles);
      setPreviewWord(word);
      setPreviewPoints(points);
    } else {
      setPreviewWord("");
      setPreviewPoints(0);
    }
  }, [placedTiles]);

  const calculateMoveScore = (tiles: TileMove[]): number => {
    return tiles.reduce((total, tile) => total + tile.points, 0);
  };

  const handleTileDragStart = useCallback((tile: string, index: number) => {
    setDraggedTile({ letter: tile, index });
  }, []);

  const handleTileDragEnd = useCallback(() => {
    setDraggedTile(null);
  }, []);

  const handleTileDrop = useCallback((row: number, col: number) => {
    if (!draggedTile || !gameState) return;

    // Check if position is valid
    const index = row * 15 + col;
    if (gameState.game.board[index] !== null) {
      toast({
        title: "Invalid position",
        description: "This position is already occupied",
        variant: "destructive",
      });
      return;
    }

    // Add tile to placed tiles
    const newTile: TileMove = {
      letter: draggedTile.letter,
      row,
      col,
      points: getTilePoints(draggedTile.letter),
    };

    setPlacedTiles(prev => [...prev, newTile]);
    setDraggedTile(null);
  }, [draggedTile, gameState, toast]);

  const handleTileRemove = useCallback((row: number, col: number) => {
    setPlacedTiles(prev => prev.filter(tile => !(tile.row === row && tile.col === col)));
  }, []);

  const handleSubmitMove = useCallback(() => {
    if (!gameState || placedTiles.length === 0) return;

    const word = placedTiles.map(tile => tile.letter).join('');
    
    // Basic word validation
    if (!isValidBanglaWord(word)) {
      toast({
        title: "Invalid word",
        description: `"${word}" is not a valid Bangla word`,
        variant: "destructive",
      });
      return;
    }

    const score = calculateMoveScore(placedTiles);
    
    submitMoveMutation.mutate({
      word,
      tiles: placedTiles,
      score,
    });
  }, [gameState, placedTiles, submitMoveMutation, toast]);

  const handleShuffleTiles = useCallback(() => {
    // In a real implementation, this would shuffle the player's tiles
    toast({
      title: "Tiles shuffled",
      description: "Your tiles have been shuffled",
    });
  }, [toast]);

  const handleSkipTurn = useCallback(() => {
    skipTurnMutation.mutate();
  }, [skipTurnMutation]);

  const handleResetBoard = useCallback(() => {
    setPlacedTiles([]);
    setPreviewWord("");
    setPreviewPoints(0);
    toast({
      title: "Board reset",
      description: "Your placed tiles have been removed",
    });
  }, [toast]);

  const handleLeaveGame = useCallback(() => {
    setLocation("/");
  }, [setLocation]);

  const handleSettings = useCallback(() => {
    toast({
      title: "Settings",
      description: "Settings panel would open here",
    });
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading game...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Game not found</div>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">You are not part of this game</div>
      </div>
    );
  }

  const canSubmitMove = placedTiles.length > 0 && previewWord.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader onLeaveGame={handleLeaveGame} onSettings={handleSettings} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Players List */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <PlayersList gameState={gameState} currentPlayerId={playerId} />
            <div className="mt-6">
              <GameControls
                gameState={gameState}
                currentPlayerId={playerId}
                onSubmitMove={handleSubmitMove}
                onShuffleTiles={handleShuffleTiles}
                onSkipTurn={handleSkipTurn}
                onResetBoard={handleResetBoard}
                canSubmitMove={canSubmitMove}
                pendingMove={submitMoveMutation.isPending}
              />
            </div>
          </div>

          {/* Game Board */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <GameBoard
              board={gameState.game.board}
              onTileDrop={handleTileDrop}
              onTileRemove={handleTileRemove}
              placedTiles={placedTiles}
            />
          </div>

          {/* Tile Rack */}
          <div className="xl:col-span-1 order-3">
            <TileRack
              tiles={currentPlayer.tiles}
              onTileDragStart={handleTileDragStart}
              onTileDragEnd={handleTileDragEnd}
              previewWord={previewWord}
              previewPoints={previewPoints}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
