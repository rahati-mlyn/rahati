
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NightModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const NightModeToggle: React.FC<NightModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle 
            pressed={isDarkMode}
            onPressedChange={onToggle}
            className="rounded-full p-2 transition-all hover:bg-white/10 dark:hover:bg-white/5 hover:scale-110"
            aria-label={isDarkMode ? "تبديل للوضع النهاري" : "تبديل للوضع الليلي"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-300 animate-pulse" />
            ) : (
              <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NightModeToggle;
