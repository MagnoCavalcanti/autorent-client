import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface VendedoresFiltroProps {
  value: string;
  onChange: (value: string) => void;
}

function VendedoresFiltro({ value, onChange }: VendedoresFiltroProps) {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar vendedor por nome..."
          className="pl-9"
        />
      </div>
      {value.trim() && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="text-zinc-300 hover:text-zinc-100"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}

export default VendedoresFiltro;
