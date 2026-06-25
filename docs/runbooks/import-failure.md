# Runbook — falha de importação

1. Localize o `import_batch_id` nos logs sanitizados.
2. Confirme se o arquivo original e seu SHA-256 estão preservados.
3. Verifique parser, versão, registros processados e falhos.
4. Corrija o parser sem editar o payload bruto.
5. Execute novamente usando o mesmo lote ou uma tentativa vinculada.
6. Confirme idempotência e recalcule apenas agregações afetadas.

Nunca copie conteúdo clínico completo para tickets ou logs.

