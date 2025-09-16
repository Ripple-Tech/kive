import { AlertTriangle } from "lucide-react";

interface FormErrorProps {
  message?: string; 
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-4 text-sm text-destructive">
      <AlertTriangle className="w-4 h-4 text-red-500" />
      <p>{message}</p>
    </div>
  );
};
