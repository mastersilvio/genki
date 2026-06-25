# Genki

Genki é uma plataforma pessoal e longitudinal para consolidar dados de saúde de múltiplas fontes sem prender o domínio a um fabricante. Esta implementação cobre a Fundação e o Modelo Canônico (Fases 0 e 1 do [PRD](docs/product/GENKI_PRD.md)); integrações reais, incluindo Garmin, ficam para fases posteriores.

## O que já existe

- monorepo Bun + Turborepo;
- API Elysia com OpenAPI, autenticação local, request ID e logs estruturados;
- PostgreSQL + Drizzle com o modelo de procedência e medições da Fase 1;
- Redis e readiness checks;
- contratos e domínio compartilhados;
- `MockProvider` e `MockImporter`, sem chamadas a serviços reais;
- dashboard web React/Vite;
- navegação mobile Expo;
- Docker Compose, CI, testes, seeds e documentação arquitetural.

## Requisitos

- Bun 1.3 ou superior;
- Docker com Docker Compose.

## Início rápido

```bash
cp .env.example .env
docker compose up -d postgres redis
bun install
bun run db:migrate
bun run db:seed
bun run dev
```

Se as portas padrão já estiverem ocupadas:

```bash
POSTGRES_PORT=55432 REDIS_PORT=56379 docker compose up -d postgres redis
DATABASE_URL=postgres://genki:genki@localhost:55432/genki bun run db:migrate
```

Serviços:

- API: http://localhost:3000
- OpenAPI: http://localhost:3000/api/v1/openapi
- Web: http://localhost:5173
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

O seed cria o usuário local `silvio@example.com` com a senha `genki-local-2026`. Essa credencial é sintética e serve apenas para desenvolvimento.

## Comandos

```bash
bun run lint
bun run typecheck
bun run test
bun run build
bun run check
bun run db:generate
bun run db:migrate
bun run db:seed
```

O build padrão valida o aplicativo Expo por TypeScript. A exportação web,
opcional e mais intensiva em memória, pode ser executada com
`bun --cwd apps/mobile export:web`.

Para executar toda a stack em containers:

```bash
docker compose up --build
```

## Estrutura

```text
apps/api       API REST Elysia
apps/web       Dashboard React
apps/mobile    Aplicativo Expo
apps/ai        Reserva para serviços Python futuros
packages/      Banco, contratos, domínio, configuração, logs e testes
docs/          PRD, arquitetura, segurança, banco, ADRs e runbooks
scripts/       Importadores Python
```

## Segurança

Não use as chaves ou credenciais de desenvolvimento em produção. Dados de saúde exigem HTTPS, segredos fortes, armazenamento criptografado, backups protegidos e revisão do modelo de ameaças em `docs/security`.
