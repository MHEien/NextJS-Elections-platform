import { ReactNode } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AlertProps {
  title: string;
  description: string;
  variant: "destructive" | "default";
  icon: ReactNode;
}

export function CustomAlert({ title, description, variant, icon }: AlertProps) {
  return (
    <Alert variant={variant}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
