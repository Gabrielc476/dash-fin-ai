// src/components/moleculas/orcamentos/BarraProgresso/index.tsx
import { useEffect, useState } from 'react';

interface BarraProgressoProps {
  percentual: number;
  textoPercentual?: string;
  altura?: string;
  mostrarTexto?: boolean;
}

export function BarraProgresso({
  percentual,
  textoPercentual,
  altura = "h-6",
  mostrarTexto = true,
}: BarraProgressoProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Animate the progress bar width on mount and when percentual changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(Math.min(100, percentual));
    }, 100);

    return () => clearTimeout(timer);
  }, [percentual]);

  // Determine the color based on the percentage
  const getBarColor = () => {
    if (percentual > 100) return "bg-red-600";
    if (percentual > 80) return "bg-amber-500";
    return "bg-primary";
  };

  // Format the percentage text to display
  const displayText = textoPercentual || `${Math.round(percentual)}%`;

  return (
    <div className="w-full">
      <div className={`w-full ${altura} bg-muted rounded-full overflow-hidden relative`}>
        <div
          className={`${altura} ${getBarColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${animatedWidth}%` }}
        ></div>
        
        {mostrarTexto && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-medium ${percentual > 50 ? 'text-white' : 'text-foreground'}`}>
              {displayText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}