import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Button } from "../components/ui/button";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Start Game", path: "/startGame" },
  { label: "Rankings", path: "/ranking" },
  { label: "Results", path: "/results" },
  { label: "Add Player", path: "/addplayer" },
  { label: "Party Page", path: "/partypage" },
];

export function Menu({ isOpen, onClose }: MenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={cn(
          // Base styles
          "w-full sm:w-80 md:w-96 p-0",
          // Background and blur
          "bg-black/95 backdrop-blur-sm",
          // Animation
          "transition-transform duration-300 ease-in-out",
          // Border and shadow
          "border-l border-green-800/20",
          // Mobile optimization
          "touch-manipulation"
        )}
      >
        <SheetHeader className={cn(
          "p-6 border-b border-green-800/20",
          "bg-green-900/20"
        )}>
          <SheetTitle className={cn(
            "font-['DS-DIGI'] text-3xl text-green-100",
            "text-center tracking-wider"
          )}>
            Menu
          </SheetTitle>
        </SheetHeader>
        <div className={cn(
          "flex flex-col",
          "p-4 sm:p-6",
          "space-y-3 sm:space-y-4"
        )}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="secondary"
              className={cn(
                // Base styles
                "w-full font-['DS-DIGI']",
                // Text styling
                "text-xl sm:text-2xl text-green-100",
                // Padding and height
                "py-6 sm:py-8",
                // Colors and effects
                "bg-green-900/20 hover:bg-green-900/40",
                "border border-green-800/20",
                // Hover and active states
                "hover:scale-[1.02] active:scale-[0.98]",
                "transition-all duration-200",
                // Shadow effects
                "shadow-sm hover:shadow-md",
                "rounded-[5px]",
                // Mobile optimization
                "tap-highlight-transparent"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}