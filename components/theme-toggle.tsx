'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Determina si estamos en un entorno que pueda renderizar el componente
  // Esto evita errores de hidratación en el servidor
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Renderiza un placeholder o nada en el servidor
    return <div className="w-[88px] h-[24px]" />; // Placeholder del mismo tamaño para evitar saltos de layout
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
          theme === 'dark' ? 'text-muted-foreground scale-75' : 'text-foreground scale-100 rotate-0'
        }`}
      />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
          theme === 'light' ? 'text-muted-foreground scale-75' : 'text-foreground scale-100 rotate-0'
        }`}
      />
    </div>
  );
}
