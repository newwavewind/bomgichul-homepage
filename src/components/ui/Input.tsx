interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block font-display text-body-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-[var(--radius-input)] border border-mist bg-paper
          px-4 py-3 font-display text-body text-ink
          outline-none placeholder:text-ash
          focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20
          disabled:cursor-not-allowed disabled:bg-surface disabled:text-ash
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, id, className = "", ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block font-display text-body-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`
          w-full resize-y rounded-[var(--radius-input)] border border-mist bg-paper
          px-4 py-3 font-display text-body text-ink
          outline-none placeholder:text-ash
          focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20
          disabled:cursor-not-allowed disabled:bg-surface
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
