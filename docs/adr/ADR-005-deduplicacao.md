# ADR-005 — Estratégia de deduplicação

**Status:** Aceito

Arquivos usam SHA-256 por usuário. Registros usam IDs externos quando disponíveis e fingerprints quando não existem. Duplicatas futuras serão agrupadas sem apagar originais.

