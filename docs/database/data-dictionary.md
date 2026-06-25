# Dicionário de dados — Fase 1

| Tabela | Responsabilidade |
|---|---|
| `users` | Proprietário e credenciais locais |
| `providers` | Catálogo de origens, sem acoplamento ao domínio |
| `provider_connections` | Contas e estado de conexão por usuário |
| `source_applications` | Aplicativo que originou o dado |
| `devices` | Dispositivos conhecidos do usuário |
| `provider_devices` | Identidade do dispositivo em cada provider |
| `device_usage_periods` | Períodos, inclusive aproximados e sobrepostos |
| `import_batches` | Execução auditável de uma importação |
| `source_files` | Arquivo original e checksum SHA-256 |
| `measurement_units` | Unidades e códigos UCUM quando disponíveis |
| `metric_definitions` | Catálogo canônico de métricas |
| `measurements` | Valores originais, normalizados e procedência |
| `daily_metric_summaries` | Agregações diárias recalculáveis |
| `source_priorities` | Preferência por métrica, fonte e período |

Todas as entidades principais usam UUID, `created_at` e `updated_at`. Valores de saúde são armazenados como `NUMERIC`, nunca como ponto flutuante binário.
