# Runbook — restauração

1. Isole o ambiente de destino.
2. Valide checksum e chave do backup.
3. Restaure PostgreSQL e, depois, o diretório privado de arquivos.
4. Execute migrations pendentes.
5. Valide contagens, chaves estrangeiras e arquivos.
6. Inicie a API e teste `/api/v1/health` e `/api/v1/readiness`.
7. Registre o RPO e RTO observados.

Metas iniciais: RPO de 24 horas e RTO de 2 horas.

