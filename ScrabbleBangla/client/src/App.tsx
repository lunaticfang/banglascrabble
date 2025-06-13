import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { apiRequest } from "./lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GamePage from "./pages/game";
import NotFound from "@/pages/not-found";

function HomePage() {
  const [username, setUsername] = useState("");
  const [player, setPlayer] = useState<any>(null);
  const [gameId, setGameId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load player from localStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem("bangla-scrabble-player");
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }
  }, []);

  const createPlayerMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest("POST", "/api/players", { username });
      return response.json();
    },
    onSuccess: (playerData) => {
      setPlayer(playerData);
      localStorage.setItem("bangla-scrabble-player", JSON.stringify(playerData));
      toast({
        title: "Welcome!",
        description: `Hello ${playerData.username}! You can now join or create games.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/games");
      return response.json();
    },
    onSuccess: async (gameData) => {
      // Join the game immediately
      try {
        await apiRequest("POST", `/api/games/${gameData.id}/join`, { 
          playerId: player.id 
        });
        setGameId(gameData.id);
        toast({
          title: "Game created!",
          description: "You've joined the new game. Waiting for other players...",
        });
      } catch (error: any) {
        toast({
          title: "Error joining game",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error creating game",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      createPlayerMutation.mutate(username.trim());
    }
  };

  const handleCreateGame = () => {
    if (player) {
      createGameMutation.mutate();
    }
  };

  // If we have a game ID, show the game
  if (gameId && player) {
    return <GamePage gameId={gameId} playerId={player.id} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Bangla Scrabble</h1>
          <p className="text-slate-600 mt-2">Online Multiplayer Word Game</p>
        </div>

        {!player ? (
          /* Player Creation */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Join the Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePlayer} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={2}
                    maxLength={20}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createPlayerMutation.isPending}
                >
                  {createPlayerMutation.isPending ? "Creating..." : "Create Player"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Game Options */
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {player.username}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleCreateGame}
                className="w-full"
                disabled={createGameMutation.isPending}
              >
                {createGameMutation.isPending ? "Creating..." : "Create New Game"}
              </Button>
              
              <div className="text-center text-sm text-slate-500">
                Game will start when 2-4 players join
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setPlayer(null);
                  localStorage.removeItem("bangla-scrabble-player");
                }}
                className="w-full"
              >
                Switch Player
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Game Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 space-y-2">
              <h3 className="font-semibold text-slate-900">How to Play:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Form words using Bangla letters</li>
                <li>Drag tiles from your rack to the board</li>
                <li>Score points based on letter values</li>
                <li>Use premium squares for bonus points</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
