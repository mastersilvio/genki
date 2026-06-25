# Visão da arquitetura

O Genki separa aquisição, normalização e consulta para impedir que fabricantes ditem o domínio.

```text
Web / Mobile
      |
API REST Elysia
      |
Serviços de ingestão ── HealthDataProvider / HealthDataImporter
      |
PostgreSQL (canônico + procedência) ── Redis (locks e filas futuras)
      |
Storage privado (arquivos e payloads brutos)
```

## Limites da implementação atual

As Fases 0 e 1 fornecem autenticação local, infraestrutura, contratos, modelo canônico inicial, mock provider/importer e interfaces básicas. Não há integração Garmin, OCR, IA ou acesso a contas externas.

## Regras arquiteturais

- providers nunca gravam diretamente no banco;
- DTOs externos são normalizados antes da persistência;
- timestamps persistidos usam timezone;
- valores numéricos de saúde usam `NUMERIC`;
- todo registro canônico pode apontar para provider, aplicação, dispositivo, lote e arquivo;
- dados brutos são imutáveis e separados dos valores normalizados;
- as APIs são versionadas em `/api/v1`.

