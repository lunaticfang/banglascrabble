import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { GameState } from "@shared/schema";

interface PlayersListProps {
  gameState: GameState;
  currentPlayerId: number;
}

export function PlayersList({ gameState, currentPlayerId }: PlayersListProps) {
  const { game, players } = gameState;

  const getPlayerInitial = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const getPlayerColor = (index: number) => {
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Users className="text-blue-600 mr-2" />
            Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players.map((player, index) => {
              const isCurrentTurn = game.currentPlayerId === player.id;
              const isCurrentPlayer = player.id === currentPlayerId;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentTurn
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getPlayerColor(index)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-medium text-sm">
                        {getPlayerInitial(player.username)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 flex items-center space-x-2">
                        <span>{player.username}</span>
                        {isCurrentPlayer && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className={`text-sm ${
                        isCurrentTurn 
                          ? 'text-blue-600 font-medium' 
                          : 'text-slate-500'
                      }`}>
                        {isCurrentTurn ? 'Current Turn' : 'Waiting'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      {player.score}
                    </div>
                    <div className="text-xs text-slate-500">points</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {game.tileBag.length}
                </div>
                <div className="text-xs text-slate-500">Tiles Left</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {gameState.moves.length}
                </div>
                <div className="text-xs text-slate-500">Moves</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
