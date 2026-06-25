# Classificação de dados

| Classe | Exemplos | Tratamento |
|---|---|---|
| Pública | documentação e versão da API | pode ser publicada |
| Interna | métricas operacionais sem identificação | acesso da aplicação |
| Confidencial | e-mail e inventário de dispositivos | autenticação e acesso por proprietário |
| Altamente sensível | saúde, localização, documentos, tokens | criptografia, logs sanitizados e acesso mínimo |

Payloads brutos, documentos clínicos e coordenadas nunca devem aparecer integralmente em logs.
