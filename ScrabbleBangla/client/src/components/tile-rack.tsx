import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GripHorizontal, Book, Info } from "lucide-react";
import { getTilePoints } from "@/lib/bangla-tiles";
import { useState } from "react";

interface TileRackProps {
  tiles: string[];
  onTileDragStart: (tile: string, index: number) => void;
  onTileDragEnd: () => void;
  previewWord?: string;
  previewPoints?: number;
}

export function TileRack({
  tiles,
  onTileDragStart,
  onTileDragEnd,
  previewWord,
  previewPoints,
}: TileRackProps) {
  const [searchWord, setSearchWord] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <GripHorizontal className="text-blue-600 mr-2" />
            Your Tiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {tiles.map((tile, index) => (
              <div
                key={`${tile}-${index}`}
                className="bg-tile-bg border-2 border-tile-border rounded-lg p-2 cursor-move hover:shadow-md transition-all duration-200 aspect-square flex items-center justify-center font-semibold text-slate-900 select-none"
                draggable
                onDragStart={() => onTileDragStart(tile, index)}
                onDragEnd={onTileDragEnd}
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                <div className="text-center">
                  <div className="text-xl font-bangla">
                    {tile || '?'}
                  </div>
                  <div className="text-xs">
                    {getTilePoints(tile)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">
              <div className="flex justify-between items-center">
                <span>Tiles in rack:</span>
                <Badge variant="secondary">{tiles.length}/7</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Move Preview */}
      {previewWord && (
        <Card>
          <CardHeader>
            <CardTitle>Current Move</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-800 font-medium">Word Preview</div>
              <div className="text-lg font-bangla font-semibold text-amber-900 mt-1">
                {previewWord}
              </div>
              <div className="text-sm text-amber-700 mt-1">
                Points: <span className="font-medium">{previewPoints || 0}</span>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 mt-3 flex items-center">
              <Info className="mr-2 h-3 w-3" />
              Drag tiles to board to form words
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dictionary Helper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="mr-2 h-4 w-4" />
            Quick Dictionary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search Bangla words..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="font-bangla"
          />
          <div className="text-xs text-slate-500 mt-2 flex items-center">
            <Book className="mr-1 h-3 w-3" />
            Validate words against Bangla dictionary
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
