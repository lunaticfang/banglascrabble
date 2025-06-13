import { Button } from "@/components/ui/button";
import { Settings, LogOut, Gamepad2 } from "lucide-react";

interface GameHeaderProps {
  onLeaveGame: () => void;
  onSettings: () => void;
}

export function GameHeader({ onLeaveGame, onSettings }: GameHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <Gamepad2 className="text-blue-600 mr-2" />
              Bangla Scrabble
            </h1>
            <span className="text-sm text-slate-500">Online Multiplayer</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="text-slate-600 hover:text-slate-900"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onLeaveGame}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave Game
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
