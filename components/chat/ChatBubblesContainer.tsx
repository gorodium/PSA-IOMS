"use client";

import { useChatGlobal } from "./ChatGlobalProvider";
import { ChatBubble } from "./ChatBubble";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { NewChatDialog } from "./NewChatDialog";

export function ChatBubblesContainer() {
  const { activeBubbles, isDockOpen } = useChatGlobal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button for New Chat */}
      <button 
        onClick={() => setIsDialogOpen(true)}
        className={cn("fixed z-[60] flex items-center justify-center w-[52px] h-[52px] rounded-full bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-xl pointer-events-auto transition-all duration-300 hover:scale-105", 
          isDockOpen ? "right-[390px] sm:right-[410px]" : "right-6", 
          "bottom-6"
        )}
        title="New Chat"
      >
        <SquarePen className="w-6 h-6" />
      </button>

      {/* Manual calculation for exact FB messenger positioning */}
      {(() => {
        let expandedCount = 0;
        let minimizedCount = 0;
        const baseRight = isDockOpen ? 410 : 24;

        return activeBubbles.map((bubble) => {
          const isMinimized = bubble.isMinimized;
          let rightPos, bottomPos;

          if (isMinimized) {
            // Stack vertically above the FAB (FAB is at bottom: 24px, height: 52px)
            bottomPos = 24 + 52 + 16 + (minimizedCount * (56 + 12)); 
            rightPos = baseRight + (52 - 56) / 2; // center align 56px bubble with 52px FAB
            minimizedCount++;
          } else {
            // Array horizontally to the left of the vertical stack
            bottomPos = 0; 
            // 56px (vertical stack width) + 24px (gap) = 80px offset for the first expanded bubble
            rightPos = baseRight + 56 + 24 + (expandedCount * (340 + 16));
            expandedCount++;
          }

          return (
            <div 
              key={bubble.channelId} 
              className="fixed z-50 pointer-events-auto transition-all duration-300 flex items-end"
              style={{ 
                right: `${rightPos}px`, 
                bottom: `${bottomPos}px`
              }}
            >
              <ChatBubble channelId={bubble.channelId} isMinimized={isMinimized} />
            </div>
          );
        });
      })()}

      <NewChatDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
