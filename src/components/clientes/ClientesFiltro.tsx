import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ClientesFiltroProps {
  value: string;
  onChange: (value: string) => void;
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function ClientesFiltro({ value, onChange }: ClientesFiltroProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onChange(localValue), 500);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const hasValue = useMemo(() => localValue.trim().length > 0, [localValue]);

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          value={localValue}
          onChange={(event) => setLocalValue(maskCpf(event.target.value))}
          placeholder="Buscar por CPF..."
          className="pl-9"
        />
      </div>
      {hasValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          aria-label="Limpar busca"
          className="text-zinc-300 hover:text-zinc-100"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}

export default ClientesFiltro;
