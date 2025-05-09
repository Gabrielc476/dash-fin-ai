"use client";

import Image from "next/image";
import Link from "next/link";
import { ROTAS } from "@/constants/rotas";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-8 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            DF
          </div>
          <span className="text-xl font-bold">Dashboard Financeiro</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={ROTAS.PUBLIC.LOGIN}
            className="text-sm font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            href={ROTAS.PUBLIC.REGISTRO}
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Criar Conta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl">
          Controle suas finanças com inteligência artificial
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Dashboard completo para análise e gestão financeira com insights
          inteligentes baseados em Claude 3.7
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ROTAS.PUBLIC.REGISTRO}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
          >
            Começar agora
          </Link>
          <Link
            href={ROTAS.PUBLIC.LOGIN}
            className="border border-input bg-background px-6 py-3 rounded-md font-medium hover:bg-accent"
          >
            Fazer login
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-4 px-8 border-t text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Dashboard Financeiro. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
