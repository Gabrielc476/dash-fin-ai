// src/componentes/templates/AutenticacaoTemplate/index.tsx
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AutenticacaoTemplateProps {
  children: React.ReactNode;
  titulo: string;
  descricao: string;
}

export function AutenticacaoTemplate({
  children,
  titulo,
  descricao,
}: AutenticacaoTemplateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="Logo do Dashboard Financeiro"
              width={60}
              height={60}
              className="mx-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold">{titulo}</CardTitle>
          <CardDescription>{descricao}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
