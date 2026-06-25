# Modelo de ameaças inicial

## Ativos

- credenciais e sessões;
- tokens de providers;
- arquivos clínicos;
- medições e metadados de saúde;
- histórico de auditoria e backups.

## Ameaças e controles

| Ameaça | Controle inicial |
|---|---|
| Roubo de credencial | Hash Argon2 via Bun, limite futuro por Redis, mensagens neutras |
| Vazamento em logs | logger estruturado com redaction de campos sensíveis |
| Acesso cruzado | toda consulta privada filtra pelo `user_id` da sessão |
| Arquivo duplicado | índice único por usuário e SHA-256 |
| Segredo no repositório | `.env` ignorado e `.env.example` sem credenciais reais |
| Interceptação | HTTPS obrigatório fora de localhost |
| Supply chain | lockfile, CI e revisão de dependências |

Antes de produção ainda são obrigatórios: cookies HttpOnly com CSRF, rotação de chaves, criptografia do storage, rate limiting, auditoria completa e teste de restauração.

