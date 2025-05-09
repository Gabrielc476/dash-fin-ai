// src/components/templates/LayoutOrcamento/index.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { ROTAS } from "@/constants/rotas";

// Components
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface LayoutOrcamentoProps {
  children: React.ReactNode;
  titulo: string;
  descricao?: string;
  voltarPara?: {
    rota: string;
    texto: string;
  };
  breadcrumbs?: {
    texto: string;
    rota?: string;
  }[];
}

export function LayoutOrcamento({
  children,
  titulo,
  descricao,
  voltarPara,
  breadcrumbs = [],
}: LayoutOrcamentoProps) {
  const router = useRouter();

  // Navigate back to previous page
  const voltar = () => {
    if (voltarPara) {
      router.push(voltarPara.rota);
    } else {
      router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumbs and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROTAS.PRIVATE.DASHBOARD}>
                <Home className="h-4 w-4 mr-1" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={ROTAS.PRIVATE.ORCAMENTOS.LISTAR}>
                Orçamentos
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Render additional breadcrumbs */}
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {breadcrumb.rota ? (
                    <BreadcrumbLink href={breadcrumb.rota}>
                      {breadcrumb.texto}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.texto}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {voltarPara && (
          <Button variant="outline" size="sm" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {voltarPara.texto}
          </Button>
        )}
      </div>

      {/* Title and Description */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
        {descricao && <p className="text-muted-foreground">{descricao}</p>}
      </div>

      {/* Main Content */}
      <div>{children}</div>
    </div>
  );
}
