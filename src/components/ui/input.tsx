import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeOff, Eye } from "lucide-react";

const inputStyles =
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

function Input({ type, className, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);

  if (type !== "password") {
    return (
      <input type={type} className={cn(inputStyles, className)} {...props} />
    );
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(inputStyles, "pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export { Input };
