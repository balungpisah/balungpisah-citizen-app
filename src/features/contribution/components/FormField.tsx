import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
        {!required && <span className="text-muted-foreground ml-1 text-xs">(opsional)</span>}
      </Label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {children}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
