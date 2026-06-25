# Genki — Product Requirements Document (PRD)

> Plataforma pessoal, longitudinal e multi-origem para consolidação, preservação, visualização e análise de dados de saúde.

| Campo | Valor |
|---|---|
| Produto | Genki |
| Documento | Product Requirements Document |
| Versão | 1.0 |
| Status | Aprovado para implementação inicial |
| Responsável pelo produto | Sílvio Meireles |
| Idioma | Português do Brasil |
| Fuso padrão de apresentação | `America/Sao_Paulo` |
| Modelo inicial | Single-user, preparado para multi-user |
| Repositório | Monorepo |
| Ferramenta principal de desenvolvimento assistido | Claude Code |

---

## 1. Resumo executivo

O **Genki** será uma plataforma pessoal de saúde destinada a consolidar dados históricos e atuais provenientes de relógios, pulseiras, balanças, aplicativos, arquivos, exames laboratoriais e outros registros clínicos.

A plataforma deverá preservar uma linha do tempo contínua mesmo quando o usuário trocar de fabricante ou dispositivo. Dados provenientes de Mi Band, Galaxy Watch, Apple Watch, Garmin, balança Xiaomi, Apple Health, Samsung Health, Health Connect, Mi Fitness e outras fontes deverão ser convertidos para um modelo canônico comum, mantendo a procedência original.

Além dos dados de wearables, o Genki armazenará exames laboratoriais, laudos, documentos médicos, medições manuais e, futuramente, condições clínicas, medicamentos, vacinas e consultas.

O sistema deverá distinguir claramente:

- dado medido diretamente;
- dado estimado pelo fabricante;
- dado calculado pelo Genki;
- dado inserido manualmente;
- dado extraído de arquivo;
- dado clínico verificado;
- dado extraído por OCR ou IA ainda não revisado.

A arquitetura deverá ser independente de fabricante. Garmin, Apple, Samsung, Xiaomi, laboratórios e arquivos serão tratados como provedores de dados, e não como o centro do domínio.

---

## 2. Visão do produto

### 2.1 Visão

Construir um repositório pessoal, auditável, seguro e longitudinal de saúde, capaz de unir dados de diferentes períodos, dispositivos e instituições em uma única linha do tempo.

### 2.2 Proposta de valor

O Genki permitirá:

- preservar dados antigos de diferentes ecossistemas;
- acompanhar tendências de saúde e condicionamento;
- comparar períodos e dispositivos;
- importar exames e resultados laboratoriais;
- gerar dashboards personalizados;
- exportar os próprios dados;
- consultar o histórico por meio de agentes de IA;
- manter independência em relação a qualquer fabricante;
- reconstruir a origem e o histórico de cada registro.

### 2.3 Princípio central

O modelo de dados não deverá ser organizado em torno de um fabricante.

Evitar:

```text
garmin_daily_summaries
apple_watch_heart_rates
xiaomi_weights
samsung_sleep
```

Preferir:

```text
measurements
sleep_sessions
workouts
body_composition_sessions
clinical_observations
```

A fonte será representada por referências como:

```text
provider_id
source_application_id
device_id
import_batch_id
source_file_id
```

---

## 3. Objetivos

### 3.1 Objetivo principal

Consolidar, preservar, consultar e analisar dados pessoais de saúde provenientes de múltiplas fontes.

### 3.2 Objetivos específicos

1. Integrar dados atuais da Garmin.
2. Importar dados históricos de Mi Band, Galaxy Watch e Apple Watch.
3. Importar dados da balança Xiaomi.
4. Integrar Apple Health e Android Health Connect por meio do aplicativo móvel.
5. Importar exportações do Samsung Health, Mi Fitness e Zepp Life.
6. Armazenar exames laboratoriais com resultados estruturados.
7. Preservar documentos médicos originais.
8. Manter dados brutos e dados normalizados.
9. Tratar sobreposição e duplicidade entre fontes.
10. Permitir prioridade de fonte por métrica e período.
11. Exibir dashboards web e mobile.
12. Oferecer API interna versionada.
13. Permitir exportação completa dos dados.
14. Preparar uma camada segura para algoritmos e IA.
15. Permitir evolução para múltiplos usuários sem redesenhar o domínio.

---

## 4. Não objetivos do MVP

Não fazem parte da primeira entrega:

- diagnóstico médico;
- prescrição de medicamentos;
- prescrição automática de treinos;
- substituição de consulta médica;
- prontuário eletrônico hospitalar completo;
- faturamento médico;
- integração com convênios;
- marketplace;
- rede social;
- compartilhamento público de dados;
- sincronização em tempo real diretamente por Bluetooth com todos os dispositivos;
- suporte inicial a todos os tipos FHIR;
- publicação imediata nas lojas de aplicativos;
- cobrança ou assinatura;
- edição dos dados originais nas plataformas de origem;
- treinamento de modelo clínico próprio;
- recomendações clínicas sem revisão profissional.

---

## 5. Usuários e personas

### 5.1 Usuário principal

O proprietário dos dados, que deseja acompanhar:

- peso;
- composição corporal;
- sono;
- frequência cardíaca;
- HRV;
- estresse;
- passos;
- atividades físicas;
- VO₂ máximo;
- carga de treino;
- pressão arterial;
- glicemia;
- resultados laboratoriais;
- histórico de dispositivos;
- evolução de indicadores ao longo dos anos.

### 5.2 Persona futura: profissional autorizado

Em versão futura, um médico, nutricionista ou treinador poderá receber acesso temporário e granular concedido pelo usuário.

Essa possibilidade não deverá ampliar o escopo inicial, mas o modelo de autorização não poderá impedir sua implementação futura.

---

## 6. Fontes de dados previstas

### 6.1 Wearables e plataformas

- Garmin Connect;
- Apple Health;
- Apple Watch;
- Samsung Health;
- Galaxy Watch;
- Android Health Connect;
- Mi Fitness;
- Zepp Life;
- Mi Band;
- Google Fit, quando necessário para recuperação histórica;
- Strava;
- Hevy;
- importações FIT, GPX e TCX.

### 6.2 Balanças e dispositivos domésticos

- Xiaomi Body Composition Scale;
- futuras balanças inteligentes;
- monitores de pressão;
- oxímetros;
- termômetros;
- glicosímetros.

### 6.3 Dados clínicos

- exames laboratoriais;
- laudos;
- exames de imagem;
- eletrocardiogramas;
- prescrições;
- relatórios médicos;
- sumários de alta;
- registros de vacinação;
- documentos FHIR;
- PDFs;
- imagens;
- CSVs;
- inserções manuais.

---

## 7. Stack tecnológica oficial

### 7.1 Backend

- Bun;
- Elysia.js;
- TypeScript;
- PostgreSQL;
- Drizzle ORM;
- schemas nativos do Elysia ou TypeBox;
- OpenAPI;
- Redis;
- BullMQ ou fila compatível com Bun;
- autenticação própria;
- API REST versionada.

### 7.2 Frontend web

- React;
- TypeScript;
- Vite;
- TanStack Query;
- TanStack Router;
- React Hook Form;
- Zod ou TypeBox compartilhado;
- Tailwind CSS;
- shadcn/ui;
- Apache ECharts ou Recharts.

### 7.3 Aplicativo móvel

- React Native;
- Expo;
- Expo Router;
- TypeScript;
- TanStack Query;
- SecureStore;
- módulos nativos para HealthKit;
- módulos nativos para Health Connect;
- notificações locais e push sem conteúdo clínico sensível.

### 7.4 Scripts, importadores e scraping

- Python 3.12 ou superior;
- Pydantic;
- pandas;
- parsers XML, CSV, JSON e FIT;
- OCR somente quando necessário;
- scripts idempotentes;
- contratos de entrada e saída versionados.

### 7.5 Algoritmos e IA

- Python;
- FastAPI somente quando um serviço separado for necessário;
- pandas;
- NumPy;
- scikit-learn;
- PyTorch quando justificado;
- detecção de anomalias;
- séries temporais;
- embeddings;
- agentes com ferramentas de leitura;
- explicações com rastreabilidade das fontes.

### 7.6 Infraestrutura e desenvolvimento

- monorepo;
- Turborepo;
- GitHub;
- GitHub Actions;
- Docker;
- Docker Compose;
- PostgreSQL;
- Redis;
- armazenamento local no MVP;
- compatibilidade futura com S3;
- Claude Code;
- ambientes development, test e production.

---

## 8. Estrutura do monorepo

```text
genki/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   ├── routes/
│   │   │   ├── plugins/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── providers/
│   │   │   ├── jobs/
│   │   │   ├── db/
│   │   │   └── index.ts
│   │   └── tests/
│   ├── web/
│   │   ├── src/
│   │   └── tests/
│   ├── mobile/
│   │   ├── app/
│   │   ├── modules/
│   │   ├── services/
│   │   └── assets/
│   └── ai/
│       ├── src/
│       ├── models/
│       ├── notebooks/
│       └── tests/
├── packages/
│   ├── database/
│   ├── contracts/
│   ├── domain/
│   ├── ui/
│   ├── config/
│   ├── logger/
│   └── test-utils/
├── scripts/
│   ├── garmin/
│   ├── apple-health/
│   ├── samsung-health/
│   ├── health-connect/
│   ├── xiaomi/
│   ├── clinical/
│   └── shared/
├── fixtures/
│   ├── garmin/
│   ├── apple-health/
│   ├── samsung-health/
│   ├── xiaomi/
│   └── clinical/
├── storage/
│   ├── imports/
│   ├── activities/
│   ├── clinical/
│   └── exports/
├── docs/
│   ├── product/
│   │   └── PRD.md
│   ├── architecture/
│   ├── adr/
│   ├── database/
│   ├── providers/
│   ├── security/
│   └── runbooks/
├── docker/
├── docker-compose.yml
├── package.json
├── bun.lock
├── turbo.json
└── README.md
```

---

## 9. Arquitetura lógica

```text
┌────────────────────┐
│ React Web          │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│ React Native/Expo  │
└─────────┬──────────┘
          │ REST/OpenAPI
┌─────────▼─────────────────────────┐
│ API Elysia.js                     │
│ auth, domínio, consulta, ingestão │
└──────┬───────────────┬────────────┘
       │               │
       ▼               ▼
┌──────────────┐  ┌───────────────┐
│ PostgreSQL   │  │ Redis / Queue │
└──────────────┘  └───────┬───────┘
                          │
          ┌───────────────▼──────────────┐
          │ Workers TypeScript/Python    │
          │ sync, parsing, OCR, AI       │
          └───────┬───────────┬──────────┘
                  │           │
       ┌──────────▼───┐  ┌────▼──────────────┐
       │ APIs/SDKs    │  │ Arquivos/imports  │
       │ de saúde     │  │ XML/CSV/FIT/PDF   │
       └──────────────┘  └───────────────────┘
```

---

## 10. Camadas de dados

### 10.1 Dados brutos

Preservam o conteúdo recebido:

- JSON de APIs;
- XML do Apple Health;
- CSV do Samsung Health;
- arquivos Xiaomi;
- FIT;
- GPX;
- TCX;
- FHIR;
- PDFs;
- imagens;
- texto extraído;
- metadados da importação.

### 10.2 Modelo canônico

Converte diferentes fontes em entidades comuns:

- medições;
- sono;
- atividade física;
- composição corporal;
- sinais vitais;
- observações clínicas;
- documentos;
- dispositivos.

### 10.3 Agregações

Contêm:

- resumos diários;
- semanais;
- mensais;
- médias móveis;
- tendências;
- estatísticas por fonte;
- estatísticas por dispositivo.

### 10.4 Inteligência

Contém:

- insights;
- anomalias;
- correlações;
- previsões;
- explicações;
- versões de algoritmos;
- evidências utilizadas;
- feedback do usuário.

---

## 11. Princípios de modelagem

1. Toda informação deve possuir procedência.
2. Provider, aplicativo e dispositivo são conceitos distintos.
3. Um registro pode não possuir dispositivo conhecido.
4. O mesmo evento pode existir em várias fontes.
5. Dados brutos não devem ser sobrescritos.
6. Valores originais e normalizados devem ser preservados.
7. Dados calculados devem informar algoritmo e versão.
8. Datas devem ser armazenadas em UTC.
9. Timezone e offset originais devem ser preservados.
10. Exames devem preservar resultado, unidade e referência originais.
11. Resultados clínicos não devem usar ponto flutuante binário.
12. Extrações por OCR ou IA exigem revisão humana.
13. Exclusões e correções clínicas devem manter histórico.
14. O domínio não deve depender de DTOs de bibliotecas externas.

---

## 12. Convenções gerais do banco

Todas as tabelas principais deverão utilizar:

```sql
id UUID PRIMARY KEY
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

Convenções:

- nomes em `snake_case`;
- timestamps em UTC;
- `NUMERIC` para valores de saúde que exigem precisão;
- `JSONB` para payloads e extensões;
- chaves estrangeiras explícitas;
- índices para consultas temporais;
- exclusão lógica somente quando necessária;
- particionamento apenas após evidência de volume;
- migrations com Drizzle;
- backfills fora de migrations estruturais.

---

# 13. Modelo de procedência

## 13.1 `users`

```text
id
email
name
birth_date
timezone
locale
preferred_unit_system
is_active
created_at
updated_at
```

## 13.2 `providers`

```text
id
code
name
provider_type
integration_type
is_official
is_active
configuration JSONB
created_at
updated_at
```

Exemplos de `code`:

```text
garmin_connect
apple_health
samsung_health
health_connect
mi_fitness
zepp_life
strava
manual
laboratory
file_import
```

## 13.3 `provider_connections`

```text
id
user_id
provider_id
external_account_id
account_identifier
status
encrypted_credentials
encrypted_token_payload
token_expires_at
last_connected_at
last_validated_at
last_successful_sync_at
last_error_code
last_error_message
configuration JSONB
created_at
updated_at
```

## 13.4 `source_applications`

```text
id
provider_id
bundle_identifier
package_name
name
version
platform
metadata JSONB
created_at
updated_at
```

## 13.5 `devices`

```text
id
user_id
manufacturer
brand
model
marketing_name
device_type
serial_number_encrypted
hardware_version
software_version
firmware_version
mac_address_encrypted
first_used_at
last_used_at
purchased_at
retired_at
is_current
metadata JSONB
created_at
updated_at
```

Tipos iniciais:

```text
smartwatch
fitness_band
smart_scale
phone
chest_strap
blood_pressure_monitor
glucose_meter
pulse_oximeter
thermometer
medical_device
other
```

## 13.6 `provider_devices`

```text
id
device_id
provider_id
external_device_id
external_product_id
external_serial_encrypted
raw_payload JSONB
created_at
updated_at
```

## 13.7 `device_usage_periods`

```text
id
user_id
device_id
started_at
ended_at
usage_type
is_primary
date_precision
notes
created_at
updated_at
```

`date_precision`:

```text
exact
day
month
year
approximate
unknown
```

`usage_type`:

```text
daily_wear
sleep_tracking
workout_tracking
weight_measurement
occasional
unknown
```

Essa tabela permite representar cronologias aproximadas, como:

```text
Mi Band → Galaxy Watch → Apple Watch → Garmin
```

## 13.8 `import_batches`

```text
id
user_id
provider_id
provider_connection_id
import_type
status
source_filename
source_file_id
started_at
finished_at
period_start
period_end
records_received
records_inserted
records_updated
records_skipped
records_failed
parser_name
parser_version
checksum
metadata JSONB
error_code
error_message
created_at
updated_at
```

## 13.9 `source_files`

```text
id
user_id
provider_id
import_batch_id
original_filename
safe_filename
content_type
file_extension
storage_backend
storage_path
size_bytes
sha256
encryption_key_version
uploaded_at
parsed_at
parser_name
parser_version
metadata JSONB
created_at
updated_at
```

---

# 14. Catálogo de métricas e unidades

## 14.1 `metric_definitions`

```text
id
code
name
description
category
value_type
canonical_unit_id
aggregation_type
minimum_valid_value NUMERIC
maximum_valid_value NUMERIC
is_sensitive
is_clinical
metadata JSONB
created_at
updated_at
```

Códigos iniciais:

```text
steps
heart_rate
resting_heart_rate
respiratory_rate
oxygen_saturation
body_temperature
weight
body_fat_percentage
fat_mass
lean_body_mass
muscle_mass
bone_mass
body_water_percentage
protein_percentage
visceral_fat
bmi
blood_pressure_systolic
blood_pressure_diastolic
blood_glucose
body_battery
stress_level
hrv_rmssd
hrv_sdnn
vo2_max
active_energy
basal_energy
distance
floors_climbed
waist_circumference
```

## 14.2 `measurement_units`

```text
id
code
name
symbol
dimension
canonical_unit_id
conversion_factor NUMERIC
conversion_offset NUMERIC
metadata JSONB
created_at
updated_at
```

Exemplos:

```text
kg
g
lb
cm
mm
m
km
bpm
percent
mmhg
mg_dl
mmol_l
celsius
fahrenheit
kcal
kj
ms
seconds
steps
```

Conversões não lineares ou contextuais deverão ser feitas em código.

---

# 15. Medições genéricas

## 15.1 `measurements`

```text
id
user_id
metric_definition_id

provider_id
provider_connection_id
source_application_id
device_id
import_batch_id
source_file_id

external_id
external_parent_id

measured_at
period_start
period_end
timezone
timezone_offset_minutes

value_numeric NUMERIC
value_integer BIGINT
value_text TEXT
value_boolean BOOLEAN
value_json JSONB

original_value_numeric NUMERIC
original_value_text TEXT
original_unit_id
canonical_unit_id

quality
confidence NUMERIC
status
origin_type

is_user_entered
is_derived
is_deleted_at_source
is_duplicate
superseded_by_id

algorithm_id
algorithm_version

source_created_at
source_updated_at
raw_payload JSONB

created_at
updated_at
```

`origin_type`:

```text
measured
estimated
calculated_by_source
calculated_by_genki
manually_entered
imported
corrected
```

`quality`:

```text
unknown
low
medium
high
verified
```

Índices:

```text
(user_id, metric_definition_id, measured_at)
(provider_id, external_id)
(device_id, measured_at)
(import_batch_id)
(source_file_id)
```

## 15.2 `daily_metric_summaries`

Tabela derivada ou importada para consulta rápida.

```text
id
user_id
summary_date
metric_definition_id
provider_id
device_id

minimum_value NUMERIC
maximum_value NUMERIC
average_value NUMERIC
sum_value NUMERIC
latest_value NUMERIC
sample_count
duration_seconds

calculation_source
calculation_version
is_source_summary
raw_payload JSONB
created_at
updated_at
```

---

# 16. Sono

## 16.1 `sleep_sessions`

```text
id
user_id

provider_id
provider_connection_id
source_application_id
device_id
import_batch_id
source_file_id

external_id
sleep_date
started_at
ended_at
timezone
timezone_offset_minutes

duration_seconds
time_in_bed_seconds
awake_seconds
light_seconds
deep_seconds
rem_seconds
unspecified_seconds

sleep_score NUMERIC
sleep_quality
sleep_need_seconds
sleep_debt_seconds

average_heart_rate NUMERIC
minimum_heart_rate NUMERIC
average_respiration_rate NUMERIC
average_spo2 NUMERIC
minimum_spo2 NUMERIC
average_stress NUMERIC
average_hrv NUMERIC

is_nap
is_primary_sleep
is_user_edited
is_derived

source_created_at
source_updated_at
raw_payload JSONB
created_at
updated_at
```

## 16.2 `sleep_stages`

```text
id
sleep_session_id
stage
started_at
ended_at
duration_seconds
confidence NUMERIC
raw_value
raw_payload JSONB
created_at
updated_at
```

Estágios:

```text
awake
light
deep
rem
in_bed
asleep
unknown
```

## 16.3 `sleep_events`

```text
id
sleep_session_id
event_type
occurred_at
ended_at
value_numeric NUMERIC
value_text
metadata JSONB
created_at
updated_at
```

---

# 17. Atividades físicas

## 17.1 `workouts`

```text
id
user_id

provider_id
provider_connection_id
source_application_id
device_id
import_batch_id
source_file_id

external_id
parent_workout_id
name
notes
workout_type
workout_subtype

started_at
ended_at
timezone
timezone_offset_minutes
duration_seconds
moving_seconds
elapsed_seconds

distance_meters NUMERIC
active_energy_kcal NUMERIC
total_energy_kcal NUMERIC

elevation_gain_meters NUMERIC
elevation_loss_meters NUMERIC

average_heart_rate NUMERIC
maximum_heart_rate NUMERIC
minimum_heart_rate NUMERIC

average_speed_mps NUMERIC
maximum_speed_mps NUMERIC
average_pace_seconds_per_km NUMERIC
best_pace_seconds_per_km NUMERIC

average_cadence NUMERIC
maximum_cadence NUMERIC
average_power NUMERIC
maximum_power NUMERIC
normalized_power NUMERIC

aerobic_training_effect NUMERIC
anaerobic_training_effect NUMERIC
exercise_load NUMERIC
vo2_max NUMERIC

start_latitude NUMERIC
start_longitude NUMERIC
end_latitude NUMERIC
end_longitude NUMERIC

is_manual
is_indoor
is_private
is_favorite

source_created_at
source_updated_at
raw_payload JSONB
created_at
updated_at
```

## 17.2 `workout_segments`

```text
id
workout_id
parent_segment_id
segment_type
sequence_number
name
started_at
ended_at
duration_seconds
moving_seconds
distance_meters NUMERIC
repetitions
weight_kg NUMERIC
average_heart_rate NUMERIC
maximum_heart_rate NUMERIC
average_speed_mps NUMERIC
average_cadence NUMERIC
average_power NUMERIC
calories NUMERIC
raw_payload JSONB
created_at
updated_at
```

Tipos:

```text
lap
split
interval
exercise
set
recovery
transition
sport
other
```

## 17.3 `workout_samples`

```text
id
workout_id
recorded_at
elapsed_seconds

latitude NUMERIC
longitude NUMERIC
altitude_meters NUMERIC
distance_meters NUMERIC

heart_rate NUMERIC
cadence NUMERIC
speed_mps NUMERIC
pace_seconds_per_km NUMERIC
power_watts NUMERIC
temperature_celsius NUMERIC

vertical_oscillation_mm NUMERIC
ground_contact_time_ms NUMERIC
stride_length_meters NUMERIC
stamina NUMERIC

metadata JSONB
created_at
updated_at
```

## 17.4 `workout_routes`

```text
id
workout_id
encoded_polyline
geojson JSONB
bounding_box JSONB
point_count
simplification_level
created_at
updated_at
```

## 17.5 `activity_files`

```text
id
workout_id
source_file_id
file_type
sha256
parser_name
parser_version
parsing_status
parsed_at
parsing_error
metadata JSONB
created_at
updated_at
```

---

# 18. Balança Xiaomi e composição corporal

## 18.1 `body_composition_sessions`

```text
id
user_id

provider_id
provider_connection_id
source_application_id
device_id
import_batch_id
source_file_id

external_id
measured_at
timezone
timezone_offset_minutes

weight_kg NUMERIC
bmi NUMERIC
body_fat_percentage NUMERIC
fat_mass_kg NUMERIC
lean_body_mass_kg NUMERIC
muscle_mass_kg NUMERIC
skeletal_muscle_percentage NUMERIC
bone_mass_kg NUMERIC
body_water_percentage NUMERIC
protein_percentage NUMERIC
visceral_fat_rating NUMERIC
basal_metabolic_rate_kcal NUMERIC
metabolic_age NUMERIC
body_score NUMERIC
body_type

impedance_ohms NUMERIC
is_athlete_mode
is_manual

source_created_at
source_updated_at
raw_payload JSONB
created_at
updated_at
```

## 18.2 `body_composition_metrics`

```text
id
body_composition_session_id
metric_definition_id
value_numeric NUMERIC
unit_id
origin_type
algorithm_id
algorithm_version
raw_payload JSONB
created_at
updated_at
```

Regra obrigatória:

- peso medido diretamente deve usar `origin_type = measured`;
- percentual de gordura calculado pelo aplicativo deve usar `calculated_by_source`;
- estimativa própria deve usar `calculated_by_genki`;
- o Genki não deverá apresentar estimativas como medições clínicas exatas.

---

# 19. Sinais vitais

## 19.1 `vital_sign_sessions`

```text
id
user_id
provider_id
source_application_id
device_id
import_batch_id
source_file_id
measured_at
timezone
context
body_position
measurement_site
notes
raw_payload JSONB
created_at
updated_at
```

Contextos:

```text
resting
sleeping
exercise
post_exercise
clinical
home
unknown
```

## 19.2 `blood_pressure_readings`

```text
id
vital_sign_session_id
systolic_mmhg NUMERIC
diastolic_mmhg NUMERIC
mean_arterial_pressure_mmhg NUMERIC
pulse_bpm NUMERIC
irregular_heartbeat_detected
cuff_location
created_at
updated_at
```

## 19.3 `blood_glucose_readings`

```text
id
vital_sign_session_id
value_mg_dl NUMERIC
original_value NUMERIC
original_unit
meal_context
specimen_type
fasting_status
created_at
updated_at
```

## 19.4 `temperature_readings`

```text
id
vital_sign_session_id
temperature_celsius NUMERIC
measurement_site
created_at
updated_at
```

## 19.5 `oxygen_saturation_readings`

```text
id
vital_sign_session_id
spo2_percentage NUMERIC
pulse_bpm NUMERIC
perfusion_index NUMERIC
created_at
updated_at
```

---

# 20. Estrutura clínica

A estrutura clínica deverá se inspirar em FHIR, preservando recursos FHIR originais quando recebidos. O Genki não precisará transformar todos os registros internos em FHIR no MVP.

## 20.1 `healthcare_organizations`

```text
id
name
organization_type
tax_identifier_encrypted
phone
email
website
address JSONB
metadata JSONB
created_at
updated_at
```

## 20.2 `healthcare_professionals`

```text
id
name
profession
specialty
registration_type
registration_number_encrypted
organization_id
metadata JSONB
created_at
updated_at
```

## 20.3 `clinical_encounters`

```text
id
user_id
organization_id
professional_id
encounter_type
status
started_at
ended_at
reason
notes
external_id
provider_id
import_batch_id
fhir_payload JSONB
raw_payload JSONB
created_at
updated_at
```

## 20.4 `clinical_documents`

```text
id
user_id
clinical_encounter_id
organization_id
professional_id
source_file_id

document_type
title
document_date
issued_at
description

language
content_type
storage_path
sha256

extraction_status
ocr_status
review_status

fhir_resource_type
fhir_resource_id
fhir_payload JSONB
extracted_text TEXT
metadata JSONB
created_at
updated_at
```

Tipos iniciais:

```text
laboratory_report
imaging_report
medical_report
prescription
discharge_summary
vaccination_record
procedure_report
pathology_report
electrocardiogram
other
```

## 20.5 `diagnostic_orders`

```text
id
user_id
encounter_id
organization_id
professional_id
ordered_at
status
clinical_indication
notes
external_id
fhir_payload JSONB
raw_payload JSONB
created_at
updated_at
```

## 20.6 `diagnostic_reports`

```text
id
user_id
diagnostic_order_id
clinical_document_id
organization_id
professional_id

report_type
status
collected_at
received_at
issued_at
reviewed_at

title
conclusion
interpretation
recommendations

external_id
fhir_payload JSONB
raw_payload JSONB
created_at
updated_at
```

## 20.7 `specimens`

```text
id
diagnostic_report_id
specimen_type
body_site
collected_at
received_at
identifier_encrypted
condition
metadata JSONB
created_at
updated_at
```

---

# 21. Catálogo e resultados de exames

## 21.1 `observation_definitions`

```text
id
code
code_system
name
short_name
category
description
default_unit_id
value_type
loinc_code
metadata JSONB
created_at
updated_at
```

Exemplos:

```text
hemoglobin
hematocrit
fasting_glucose
hba1c
total_cholesterol
hdl_cholesterol
ldl_cholesterol
triglycerides
creatinine
urea
tsh
free_t4
total_testosterone
vitamin_d
vitamin_b12
ferritin
c_reactive_protein
alt
ast
ggt
```

## 21.2 `clinical_observations`

```text
id
user_id

diagnostic_report_id
diagnostic_order_id
specimen_id
observation_definition_id

provider_id
import_batch_id
source_file_id

external_id
observed_at
issued_at

status
value_type

value_numeric NUMERIC
value_integer BIGINT
value_text TEXT
value_boolean BOOLEAN
value_code
value_json JSONB

original_value_text
original_unit_text
unit_id

reference_range_low NUMERIC
reference_range_high NUMERIC
reference_range_text

interpretation_code
interpretation_text
abnormal_flag

method
instrument
laboratory_name

is_fasting
is_verified
is_manual
is_corrected

fhir_payload JSONB
raw_payload JSONB
created_at
updated_at
```

Status:

```text
registered
preliminary
final
corrected
cancelled
entered_in_error
unknown
```

Flags:

```text
low
high
critical_low
critical_high
abnormal
normal
indeterminate
not_applicable
unknown
```

## 21.3 `observation_reference_ranges`

```text
id
clinical_observation_id
low_value NUMERIC
high_value NUMERIC
unit_id
age_min_days
age_max_days
sex
population
condition
text
created_at
updated_at
```

## 21.4 `observation_components`

```text
id
clinical_observation_id
observation_definition_id
sequence_number
value_numeric NUMERIC
value_text
value_code
unit_id
reference_range_low NUMERIC
reference_range_high NUMERIC
abnormal_flag
raw_payload JSONB
created_at
updated_at
```

---

# 22. Imagem e procedimentos

## 22.1 `imaging_studies`

```text
id
user_id
diagnostic_report_id
organization_id
professional_id

modality
body_site
started_at
ended_at

accession_number_encrypted
study_instance_uid_encrypted

description
findings
impression

dicom_available
dicom_storage_path
raw_payload JSONB
created_at
updated_at
```

## 22.2 `clinical_procedures`

```text
id
user_id
encounter_id
organization_id
professional_id

procedure_code
code_system
name
status
performed_at
body_site
reason
outcome
notes

fhir_payload JSONB
raw_payload JSONB
created_at
updated_at
```

---

# 23. Expansão clínica futura

Preparar as seguintes tabelas, ainda que algumas sejam implementadas após o MVP:

## 23.1 `medical_conditions`

```text
id
user_id
code
code_system
name
clinical_status
verification_status
onset_at
resolved_at
severity
notes
source_document_id
fhir_payload JSONB
created_at
updated_at
```

## 23.2 `allergies`

```text
id
user_id
substance
reaction
severity
clinical_status
verification_status
onset_at
notes
source_document_id
fhir_payload JSONB
created_at
updated_at
```

## 23.3 `medications`

```text
id
name
active_ingredient
form
strength
manufacturer
code
code_system
metadata JSONB
created_at
updated_at
```

## 23.4 `medication_usages`

```text
id
user_id
medication_id
prescriber_id
started_at
ended_at
status
dosage_text
dose_value NUMERIC
dose_unit
frequency
route
reason
notes
source_document_id
fhir_payload JSONB
created_at
updated_at
```

## 23.5 `immunizations`

```text
id
user_id
vaccine_name
manufacturer
lot_number_encrypted
administered_at
dose_number
site
route
organization_id
professional_id
source_document_id
fhir_payload JSONB
created_at
updated_at
```

---

# 24. Duplicidades e registros concorrentes

## 24.1 Problema

Uma corrida pode aparecer:

1. na Garmin;
2. no Apple Health;
3. no Strava;
4. em um arquivo FIT importado.

Ela não deve ser somada quatro vezes.

## 24.2 `data_clusters`

```text
id
user_id
cluster_type
canonical_record_type
canonical_record_id
deduplication_status
confidence NUMERIC
created_by
algorithm_id
algorithm_version
metadata JSONB
created_at
updated_at
```

## 24.3 `data_cluster_members`

```text
id
data_cluster_id
record_type
record_id
provider_id
match_score NUMERIC
match_reasons JSONB
is_canonical
created_at
updated_at
```

## 24.4 Critérios de deduplicação

### Atividades

- horário inicial;
- duração;
- distância;
- modalidade;
- frequência cardíaca;
- rota;
- dispositivo;
- identificadores;
- origem declarada.

### Sono

- sobreposição temporal;
- duração;
- dispositivo;
- sessão principal ou cochilo;
- estágios.

### Peso

- timestamp;
- valor;
- dispositivo;
- origem;
- importação propagada.

### Exames

- laboratório;
- data de coleta;
- número do documento;
- conjunto de observações;
- checksum do arquivo.

O dado produzido pelo dispositivo original deverá ter preferência sobre cópias propagadas entre plataformas.

---

# 25. Prioridade das fontes

## 25.1 `source_priorities`

```text
id
user_id
metric_definition_id
provider_id
device_id
priority
valid_from
valid_until
notes
created_at
updated_at
```

A prioridade poderá variar por período.

Exemplos:

```text
Peso:
1. Balança Xiaomi
2. Apple Health
3. Inserção manual

Passos em 2026:
1. Garmin
2. Apple Health

Passos em 2023:
1. Apple Watch
2. Samsung Health
```

---

# 26. Auditoria e versões

## 26.1 `record_versions`

```text
id
record_type
record_id
version_number
changed_by_user_id
change_type
previous_data JSONB
new_data JSONB
changed_at
reason
created_at
```

Registros clínicos corrigidos não deverão ser sobrescritos sem histórico.

## 26.2 `audit_events`

```text
id
user_id
actor_type
actor_id
action
resource_type
resource_id
request_id
ip_hash
user_agent
metadata JSONB
occurred_at
created_at
```

---

# 27. Revisão humana de dados clínicos

## 27.1 `clinical_review_tasks`

```text
id
user_id
import_batch_id
clinical_document_id
status
review_type
assigned_to_user_id
created_at
completed_at
metadata JSONB
updated_at
```

Tipos:

```text
ocr_validation
observation_validation
patient_matching
unit_validation
reference_range_validation
duplicate_validation
```

Regras:

- resultado extraído por OCR começa como não verificado;
- resultado extraído por IA começa como não verificado;
- o usuário deve visualizar o documento original ao revisar;
- correções devem gerar versão;
- o parser e sua versão devem ser armazenados.

---

# 28. Modelo de providers

```typescript
export interface HealthDataProvider {
  readonly code: string;

  authenticate?(
    input: AuthenticationInput
  ): Promise<AuthenticationResult>;

  validateConnection?(
    connection: ProviderConnection
  ): Promise<ConnectionValidationResult>;

  discoverDevices?(
    context: ProviderContext
  ): Promise<ProviderDevice[]>;

  syncMeasurements?(
    request: MeasurementSyncRequest
  ): Promise<MeasurementSyncResult>;

  syncSleep?(
    request: SleepSyncRequest
  ): Promise<SleepSyncResult>;

  syncWorkouts?(
    request: WorkoutSyncRequest
  ): Promise<WorkoutSyncResult>;

  syncBodyComposition?(
    request: BodyCompositionSyncRequest
  ): Promise<BodyCompositionSyncResult>;

  importFile?(
    request: FileImportRequest
  ): Promise<FileImportResult>;
}
```

Implementações previstas:

```text
GarminProvider
AppleHealthProvider
SamsungHealthProvider
HealthConnectProvider
MiFitnessProvider
ZeppLifeProvider
FileImportProvider
ManualProvider
MockProvider
```

Nenhum provider deverá gravar diretamente no banco. Ele deverá produzir DTOs canônicos processados por serviços de ingestão.

---

# 29. Modelo de importadores Python

```python
class HealthDataImporter(Protocol):
    name: str
    version: str

    def supports(self, source_file: SourceFile) -> bool:
        ...

    def inspect(self, source_file: SourceFile) -> ImportInspection:
        ...

    def parse(self, source_file: SourceFile) -> Iterator[RawRecord]:
        ...

    def normalize(self, record: RawRecord) -> CanonicalRecord:
        ...

    def validate(self, record: CanonicalRecord) -> ValidationResult:
        ...
```

Importadores previstos:

```text
AppleHealthXmlImporter
GarminFitImporter
GarminJsonImporter
SamsungHealthCsvImporter
HealthConnectImporter
MiFitnessImporter
ZeppLifeImporter
GenericCsvMeasurementImporter
ClinicalLaboratoryPdfImporter
ClinicalLaboratoryCsvImporter
FhirBundleImporter
```

---

# 30. Integrações

## 30.1 Garmin

MVP:

- script Python;
- biblioteca comunitária isolada em adapter;
- sincronização incremental;
- sincronização histórica;
- download e parsing FIT;
- tokens criptografados;
- suporte a MFA;
- rate limiting conservador.

Futuro:

- Garmin Connect Developer Program;
- OAuth;
- Health API;
- Activity API.

## 30.2 Apple Health e Apple Watch

- integração pelo aplicativo React Native;
- módulo HealthKit;
- importação do `export.xml`;
- leitura de source, source version, device e metadata;
- importação de workouts e rotas;
- permissões granulares;
- nenhum dado deve ser lido sem autorização explícita.

## 30.3 Samsung Health e Galaxy Watch

- priorizar Health Connect quando possível;
- avaliar SDK oficial Samsung;
- importar exportações históricas;
- preservar dispositivo e aplicação;
- detectar dados repassados para outras plataformas.

## 30.4 Mi Band e balança Xiaomi

- Mi Fitness;
- Zepp Life;
- Apple Health;
- Health Connect;
- exportações da conta;
- arquivos CSV/JSON;
- inserção manual;
- importação de backup legítimo pertencente ao usuário;
- não depender de uma única API não oficial.

## 30.5 Exames

- inserção manual;
- upload de PDF;
- upload de imagem;
- CSV;
- JSON;
- FHIR;
- extração por OCR;
- extração assistida por IA;
- confirmação humana obrigatória;
- futura integração com laboratórios.

---

# 31. Fluxo de importação

1. O usuário seleciona a fonte.
2. Envia um arquivo ou inicia a sincronização.
3. O sistema cria um `import_batch`.
4. Calcula SHA-256 do arquivo.
5. Detecta arquivo já importado.
6. Armazena o original de forma privada.
7. Identifica parser e versão.
8. Inspeciona período e volume.
9. Mostra uma prévia, quando aplicável.
10. Processa em lotes.
11. Preserva dados brutos.
12. Normaliza unidades.
13. Resolve dispositivos e aplicações.
14. cria ou atualiza registros idempotentemente.
15. Detecta duplicidades.
16. Cria tarefas de revisão clínica.
17. Recalcula agregações afetadas.
18. Exibe relatório final.

---

# 32. API REST

Prefixo:

```text
/api/v1
```

## 32.1 Sistema

```text
GET /health
GET /readiness
GET /version
GET /openapi
```

## 32.2 Autenticação

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/session
```

## 32.3 Providers e conexões

```text
GET    /providers
GET    /providers/:code
GET    /provider-connections
POST   /provider-connections
GET    /provider-connections/:id
DELETE /provider-connections/:id
POST   /provider-connections/:id/validate
POST   /provider-connections/:id/sync
```

## 32.4 Dispositivos

```text
GET   /devices
POST  /devices
GET   /devices/:id
PATCH /devices/:id
GET   /devices/:id/usage-periods
POST  /devices/:id/usage-periods
PATCH /device-usage-periods/:id
```

## 32.5 Importações

```text
POST /imports
GET  /imports
GET  /imports/:id
POST /imports/:id/retry
POST /imports/:id/cancel
GET  /imports/:id/errors
GET  /imports/:id/preview
```

## 32.6 Medições

```text
GET   /measurements
POST  /measurements
GET   /measurements/:id
PATCH /measurements/:id
GET   /metrics
GET   /units
```

## 32.7 Sono

```text
GET /sleep-sessions
GET /sleep-sessions/:id
GET /sleep-sessions/:id/stages
GET /sleep-sessions/:id/events
```

## 32.8 Atividades

```text
GET /workouts
GET /workouts/:id
GET /workouts/:id/samples
GET /workouts/:id/segments
GET /workouts/:id/route
GET /workouts/:id/files
POST /workouts/:id/resync
```

## 32.9 Composição corporal

```text
GET  /body-compositions
POST /body-compositions
GET  /body-compositions/:id
```

## 32.10 Sinais vitais

```text
GET  /vital-signs
POST /vital-signs
GET  /vital-signs/:id
```

## 32.11 Dados clínicos

```text
GET  /clinical/documents
POST /clinical/documents
GET  /clinical/documents/:id

GET  /clinical/reports
POST /clinical/reports
GET  /clinical/reports/:id

GET  /clinical/observations
POST /clinical/observations
GET  /clinical/observations/:id
PATCH /clinical/observations/:id

GET  /clinical/encounters
POST /clinical/encounters
GET  /clinical/encounters/:id

GET  /clinical/imaging-studies
GET  /clinical/procedures
GET  /clinical/conditions
GET  /clinical/medications
```

## 32.12 Revisão

```text
GET  /review-tasks
GET  /review-tasks/:id
POST /review-tasks/:id/approve
POST /review-tasks/:id/reject
POST /review-tasks/:id/correct
```

## 32.13 Dashboards

```text
GET /dashboard/today
GET /dashboard/weekly
GET /dashboard/monthly
GET /dashboard/trends
GET /dashboard/body-composition
GET /dashboard/laboratory
```

## 32.14 Exportações

```text
POST /exports
GET  /exports
GET  /exports/:id
GET  /exports/:id/download
DELETE /exports/:id
```

---

# 33. Contratos da API

## 33.1 Sucesso

```json
{
  "data": {},
  "meta": {
    "requestId": "uuid",
    "generatedAt": "2026-06-25T15:00:00Z"
  }
}
```

## 33.2 Lista paginada

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 50,
    "total": 120,
    "totalPages": 3,
    "requestId": "uuid"
  }
}
```

## 33.3 Erro

```json
{
  "error": {
    "code": "IMPORT_FILE_ALREADY_PROCESSED",
    "message": "Este arquivo já foi importado.",
    "details": {}
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

---

# 34. Dashboard e experiência do usuário

## 34.1 Navegação principal

```text
Hoje
Saúde
Sono
Atividades
Corpo
Exames
Tendências
Importações
Dispositivos
Conexões
Configurações
```

## 34.2 Dashboard Hoje

- passos;
- frequência cardíaca recente;
- frequência cardíaca em repouso;
- Body Battery;
- estresse;
- sono;
- HRV;
- peso mais recente;
- composição corporal;
- última atividade;
- alertas de sincronização;
- exames recentes;
- status das fontes.

## 34.3 Linha do tempo

Exibir eventos combinados:

- troca de dispositivo;
- treino;
- peso;
- sono;
- resultado laboratorial;
- consulta;
- medicamento;
- procedimento.

## 34.4 Tela de exame

- documento original;
- resultados estruturados;
- unidade original;
- faixa de referência;
- flag do laboratório;
- histórico da mesma métrica;
- origem;
- status de verificação;
- correções;
- observações.

## 34.5 Estados obrigatórios

- carregando;
- vazio;
- erro;
- dado parcial;
- sem permissão;
- sincronização em andamento;
- importação pendente;
- revisão necessária;
- fonte indisponível;
- dado duplicado;
- dado não verificado.

---

# 35. Algoritmos e indicadores

Indicadores calculados pelo Genki deverão informar:

- nome;
- descrição;
- versão;
- entradas utilizadas;
- data de cálculo;
- limitações;
- se possuem ou não finalidade clínica.

Exemplos:

- consistência semanal;
- volume semanal;
- tendência de peso;
- tendência de frequência cardíaca em repouso;
- regularidade do sono;
- correlação entre sono e treino;
- correlação entre peso e atividade;
- carga aguda;
- carga crônica;
- score experimental de recuperação.

Nenhum score experimental deverá ser descrito como diagnóstico.

---

# 36. IA

## 36.1 Casos de uso futuros

- resumir a semana;
- explicar tendências;
- comparar períodos;
- encontrar mudanças após troca de dispositivo;
- consultar exames por linguagem natural;
- preparar histórico para consulta médica;
- encontrar dados ausentes;
- sugerir perguntas para um profissional de saúde.

## 36.2 Ferramentas de leitura

```text
get_daily_health_summary
get_sleep_trend
get_weight_trend
get_training_summary
list_workouts
get_workout_detail
list_laboratory_results
get_observation_history
compare_periods
get_data_provenance
```

## 36.3 Guardrails

- não diagnosticar;
- não prescrever;
- distinguir associação de causalidade;
- citar registros utilizados;
- mostrar período analisado;
- identificar dados ausentes;
- não enviar dados para terceiros sem consentimento;
- ocultar coordenadas por padrão;
- permitir desativar IA;
- registrar auditoria de consultas.

---

# 37. Segurança e privacidade

Dados de saúde são altamente sensíveis.

Requisitos:

- autenticação obrigatória;
- cookies `HttpOnly`;
- proteção CSRF;
- HTTPS fora de localhost;
- tokens criptografados;
- documentos criptografados em repouso;
- chaves fora do banco;
- URLs temporárias;
- logs sanitizados;
- backups criptografados;
- usuário não-root em containers;
- controle de acesso por proprietário;
- trilha de auditoria;
- exclusão completa mediante confirmação;
- nenhuma informação clínica em push;
- nenhuma credencial em `.env.example`;
- rotação de chaves;
- limite de tentativas;
- política de sessão;
- headers de segurança.

Variáveis:

```dotenv
APP_ENV=development
APP_TIMEZONE=America/Sao_Paulo
APP_SECRET_KEY=
DATA_ENCRYPTION_KEY=
DATABASE_URL=
REDIS_URL=
STORAGE_BACKEND=local
LOCAL_STORAGE_PATH=/data/storage
```

---

# 38. LGPD

Aplicar:

- finalidade;
- necessidade;
- transparência;
- segurança;
- prevenção;
- não discriminação;
- responsabilização;
- portabilidade;
- eliminação;
- consentimento quando aplicável.

O usuário deverá conseguir:

- exportar seus dados;
- apagar uma fonte;
- apagar arquivos;
- apagar payloads brutos;
- revogar conexão;
- apagar a conta;
- consultar acessos;
- desabilitar IA.

---

# 39. Resiliência e idempotência

## 39.1 Regras

- repetir uma importação não pode duplicar dados;
- arquivo deve ser deduplicado por SHA-256;
- atividades devem usar ID externo ou fingerprint;
- medições devem usar ID externo ou chave composta;
- sincronizações devem possuir locks;
- jobs devem ser retomáveis;
- falhas parciais não devem desfazer registros válidos;
- erros de autenticação não devem gerar retries infinitos.

## 39.2 Retry inicial

```text
máximo: 4 tentativas
backoff: 2s, 5s, 15s, 45s
jitter: habilitado
```

---

# 40. Observabilidade

## 40.1 Logs

Campos:

- timestamp;
- level;
- service;
- environment;
- request_id;
- user_id anonimizado;
- import_batch_id;
- job_id;
- provider;
- resource_type;
- duration;
- result;
- error_code.

Nunca registrar:

- senha;
- MFA;
- token;
- cookies;
- arquivos clínicos;
- resultado completo de exame;
- payload de autenticação.

## 40.2 Métricas

- sincronizações;
- falhas;
- duração;
- registros processados;
- tamanho da fila;
- imports pendentes;
- revisões pendentes;
- tempo de consulta;
- tamanho do banco;
- espaço de arquivos;
- último sucesso por provider.

## 40.3 Health checks

```text
GET /api/v1/health
GET /api/v1/readiness
```

A indisponibilidade de uma fonte externa não deverá tornar o Genki indisponível para consulta.

---

# 41. Requisitos não funcionais

## 41.1 Desempenho

- dashboard: backend p95 inferior a 700 ms;
- listas: backend p95 inferior a 700 ms;
- tendências anuais: backend p95 inferior a 1,5 s;
- paginação obrigatória;
- agregações pré-calculadas quando necessário;
- consultas temporais indexadas.

## 41.2 Compatibilidade

Web:

- Chrome;
- Safari;
- Firefox;
- desktop e mobile.

Mobile:

- iOS;
- Android;
- Expo Development Build para módulos nativos.

## 41.3 Acessibilidade

- contraste adequado;
- navegação por teclado;
- labels;
- feedback não baseado apenas em cor;
- leitores de tela;
- gráficos acompanhados de resumo textual.

## 41.4 Manutenibilidade

- TypeScript estrito;
- contratos compartilhados;
- módulos por domínio;
- providers isolados;
- testes automatizados;
- ADRs;
- migrations versionadas;
- documentação de parsers.

---

# 42. Testes

## 42.1 Unitários

- conversão de unidades;
- normalização;
- timezone;
- mapeamento de providers;
- deduplicação;
- prioridades;
- criptografia;
- cálculos;
- parsing;
- redaction.

## 42.2 Integração

- PostgreSQL real;
- Redis real;
- migrations;
- repositórios;
- jobs;
- API;
- storage;
- importadores.

## 42.3 Contrato

Fixtures sanitizadas para:

- Garmin;
- Apple Health;
- Samsung Health;
- Xiaomi;
- exames;
- FHIR.

## 42.4 End-to-end

1. login;
2. cadastro de dispositivo;
3. importação simulada;
4. resolução de duplicidade;
5. dashboard;
6. upload de exame;
7. revisão;
8. exportação;
9. exclusão.

O CI nunca deverá depender de contas reais.

---

# 43. Feature flags

```text
GARMIN_PROVIDER_ENABLED
APPLE_HEALTH_ENABLED
HEALTH_CONNECT_ENABLED
SAMSUNG_HEALTH_ENABLED
XIAOMI_IMPORT_ENABLED
FIT_PARSING_ENABLED
CLINICAL_OCR_ENABLED
CLINICAL_AI_EXTRACTION_ENABLED
FHIR_IMPORT_ENABLED
EXPERIMENTAL_INSIGHTS_ENABLED
AI_ASSISTANT_ENABLED
RAW_PAYLOAD_VIEW_ENABLED
```

---

# 44. Backup e recuperação

- dump diário do PostgreSQL;
- backup de arquivos;
- retenção mínima de 7 diários e 4 semanais;
- criptografia;
- restauração documentada;
- teste periódico;
- checksums.

Metas iniciais:

```text
RPO: 24 horas
RTO: 2 horas
```

---

# 45. CI/CD

GitHub Actions deverá executar:

1. instalação com lockfile;
2. formatação;
3. lint;
4. type checking;
5. testes unitários;
6. testes de integração;
7. validação de migrations;
8. build da API;
9. build web;
10. verificação Expo;
11. build dos containers;
12. análise de vulnerabilidades;
13. verificação de segredos.

---

# 46. ADRs obrigatórios

```text
ADR-001 — Modelo canônico independente de fabricante
ADR-002 — Separação entre provider, aplicação e dispositivo
ADR-003 — Preservação de payload bruto
ADR-004 — PostgreSQL para dados temporais
ADR-005 — Estratégia de deduplicação
ADR-006 — Estrutura clínica inspirada em FHIR
ADR-007 — Separação entre TypeScript e Python
ADR-008 — Uso de Drizzle ORM
ADR-009 — Criptografia de dados sensíveis
ADR-010 — Versionamento de parsers
ADR-011 — Uso de NUMERIC em dados clínicos
ADR-012 — Prioridade de fonte por métrica e período
ADR-013 — Revisão humana de extrações clínicas
ADR-014 — Contratos compartilhados no monorepo
```

---

# 47. Fases de implementação

## Fase 0 — Fundação

- monorepo;
- Bun;
- Elysia;
- PostgreSQL;
- Drizzle;
- React;
- Expo;
- Docker;
- autenticação;
- OpenAPI;
- logs;
- CI;
- health checks.

## Fase 1 — Modelo canônico

- providers;
- connections;
- devices;
- usage periods;
- imports;
- files;
- metrics;
- units;
- measurements;
- summaries;
- priorities;
- MockProvider.

## Fase 2 — Garmin

- autenticação;
- MFA;
- sincronização;
- sono;
- métricas;
- atividades;
- FIT;
- dashboards iniciais.

## Fase 3 — Histórico de wearables

- Apple Health XML;
- Apple Health mobile;
- Samsung Health;
- Health Connect;
- Mi Fitness;
- Zepp Life;
- deduplicação.

## Fase 4 — Balança Xiaomi

- composição corporal;
- histórico;
- gráficos;
- distinção entre medido e estimado.

## Fase 5 — Exames

- organizações;
- documentos;
- relatórios;
- observações;
- referências;
- inserção manual;
- CSV;
- FHIR.

## Fase 6 — Extração clínica

- PDF;
- imagem;
- OCR;
- IA;
- revisão;
- auditoria.

## Fase 7 — Inteligência

- tendências;
- correlações;
- anomalias;
- agente;
- explicações;
- guardrails.

---

# 48. Backlog priorizado

## P0

- monorepo;
- autenticação;
- banco;
- providers;
- devices;
- imports;
- source files;
- measurements;
- sleep;
- workouts;
- composição corporal;
- Garmin;
- dashboard;
- testes;
- backup;
- segurança.

## P1

- Apple Health;
- Health Connect;
- Samsung Health;
- Xiaomi;
- deduplicação;
- exames manuais;
- PDFs;
- exportação;
- mobile.

## P2

- OCR;
- FHIR amplo;
- IA;
- correlações;
- alertas;
- acesso profissional;
- multi-user.

---

# 49. Histórias de usuário principais

## US-001 — Registrar dispositivos antigos

Como usuário, quero registrar os períodos em que usei Mi Band, Galaxy Watch, Apple Watch e Garmin para interpretar corretamente meu histórico.

### Aceite

- permite datas aproximadas;
- permite sobreposição;
- permite indicar finalidade;
- permite dispositivo principal por período.

## US-002 — Importar dados históricos

Como usuário, quero importar arquivos antigos sem duplicar eventos já existentes.

### Aceite

- calcula checksum;
- mostra prévia;
- processa em lotes;
- preserva origem;
- apresenta relatório.

## US-003 — Sincronizar Garmin

Como usuário, quero atualizar automaticamente meus dados atuais.

### Aceite

- suporta MFA;
- não armazena senha;
- tokens são criptografados;
- sincronização é idempotente;
- falhas são registradas.

## US-004 — Importar balança Xiaomi

Como usuário, quero visualizar peso e composição corporal ao longo do tempo.

### Aceite

- preserva dados medidos e estimados;
- identifica dispositivo;
- permite histórico;
- não trata estimativas como valores clínicos exatos.

## US-005 — Registrar exames

Como usuário, quero salvar exames e acompanhar cada marcador ao longo do tempo.

### Aceite

- preserva documento;
- armazena data, valor, unidade e referência;
- permite painel;
- permite revisão;
- exibe histórico.

## US-006 — Revisar extração

Como usuário, quero validar resultados extraídos de PDF antes que sejam considerados confiáveis.

### Aceite

- mostra documento e resultado;
- permite corrigir;
- registra versão;
- marca como verificado.

## US-007 — Resolver duplicidade

Como usuário, quero saber quando duas fontes representam o mesmo treino.

### Aceite

- sistema sugere cluster;
- apresenta motivo;
- permite escolher canônico;
- não apaga o original.

---

# 50. Critérios globais de aceite do MVP

O MVP estará pronto quando:

1. iniciar com Docker Compose;
2. possuir login;
3. usar Elysia e PostgreSQL;
4. possuir migrations Drizzle;
5. cadastrar dispositivos e períodos;
6. importar dados mock;
7. sincronizar Garmin;
8. armazenar medições;
9. armazenar sono;
10. armazenar atividades;
11. armazenar composição corporal;
12. registrar exame manual;
13. enviar documento clínico;
14. exibir dashboards;
15. impedir duplicação básica;
16. exportar dados;
17. manter payload bruto;
18. possuir auditoria mínima;
19. possuir testes;
20. possuir backup e documentação.

---

# 51. Instruções para Claude Code

Claude Code deverá:

1. ler este PRD;
2. ler os ADRs;
3. propor plano por fase;
4. implementar incrementos pequenos;
5. criar testes antes ou junto da implementação;
6. executar lint;
7. executar type checking;
8. executar testes;
9. validar migrations;
10. atualizar documentação;
11. apresentar arquivos alterados;
12. não avançar de fase com fundação quebrada.

Restrições:

- não usar credenciais reais;
- não chamar APIs reais no CI;
- não criar tabelas centrais por fabricante;
- não acoplar domínio a SDK externo;
- não usar SQLite como banco principal;
- não armazenar timestamps sem timezone;
- não usar `float` para exames;
- não registrar tokens;
- não remover testes para corrigir build;
- não introduzir dependências sem justificativa;
- não enviar dados clínicos a terceiros;
- não tratar OCR como verificado.

---

# 52. Primeiro prompt para Claude Code

```text
Leia docs/product/PRD.md e implemente apenas a Fase 0 e a Fase 1 do Genki.

Stack obrigatória:
- Bun
- Elysia.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- React
- React Native
- Expo
- Redis
- Docker Compose
- Turborepo
- GitHub Actions

Crie:
1. apps/api, apps/web, apps/mobile e apps/ai;
2. packages/database, contracts, domain, config, logger e test-utils;
3. autenticação local;
4. health e readiness checks;
5. OpenAPI;
6. logs estruturados e request ID;
7. migrations para:
   - users;
   - providers;
   - provider_connections;
   - source_applications;
   - devices;
   - provider_devices;
   - device_usage_periods;
   - import_batches;
   - source_files;
   - metric_definitions;
   - measurement_units;
   - measurements;
   - daily_metric_summaries;
   - source_priorities;
8. HealthDataProvider;
9. HealthDataImporter;
10. MockProvider e MockImporter;
11. seeds de providers, unidades, métricas e dispositivos sintéticos;
12. telas web básicas;
13. navegação mobile básica;
14. testes unitários e de integração;
15. Docker e CI.

Não implemente integrações reais.
Não avance para a Fase 2.
Ao terminar, execute lint, type checking, testes, migrations e builds.
Atualize a documentação e crie os ADRs da Fase 1.
```

---

# 53. Definição de pronto

Uma tarefa só estará concluída quando:

- código implementado;
- critérios de aceite atendidos;
- testes passando;
- lint passando;
- type checking passando;
- migrations validadas;
- documentação atualizada;
- nenhum segredo incluído;
- erros tratados;
- logs sanitizados;
- revisão arquitetural concluída.

---

# 54. Riscos

## 54.1 Mudanças em APIs não oficiais

Mitigação:

- adapters;
- providers isolados;
- testes de contrato;
- payload bruto;
- versões fixadas.

## 54.2 Duplicidades

Mitigação:

- clusters;
- fingerprints;
- prioridade;
- revisão manual;
- preservação do original.

## 54.3 Inconsistência entre dispositivos

Mitigação:

- procedência;
- período de uso;
- prioridade por métrica;
- não combinar silenciosamente fontes incompatíveis.

## 54.4 Vazamento de saúde

Mitigação:

- criptografia;
- acesso restrito;
- auditoria;
- backups protegidos;
- ausência de dados em logs e notificações.

## 54.5 Erros de OCR ou IA

Mitigação:

- revisão humana;
- status não verificado;
- versionamento;
- documento original lado a lado.

## 54.6 Volume temporal

Mitigação:

- índices;
- agregações;
- paginação;
- particionamento futuro;
- retenção configurável de amostras de alta frequência.

---

# 55. Documentação obrigatória

```text
docs/product/PRD.md
docs/architecture/overview.md
docs/database/data-dictionary.md
docs/security/threat-model.md
docs/security/data-classification.md
docs/providers/garmin.md
docs/providers/apple-health.md
docs/providers/health-connect.md
docs/providers/xiaomi.md
docs/runbooks/import-failure.md
docs/runbooks/restore-backup.md
docs/adr/*.md
```

---

# 56. Referências técnicas

A implementação deverá consultar prioritariamente:

- documentação oficial do Elysia e OpenAPI;
- documentação oficial do Apple HealthKit;
- documentação oficial do Android Health Connect;
- especificação HL7 FHIR;
- documentação oficial ou SDK aprovado de cada provider;
- documentação do PostgreSQL;
- documentação do Drizzle ORM;
- documentação do Expo.

---

# 57. Resultado esperado

O Genki deverá formar uma linha histórica única:

```text
Mi Band
   ↓
Galaxy Watch
   ↓
Apple Watch
   ↓
Garmin
```

Combinada com:

```text
Balança Xiaomi
Exames laboratoriais
Documentos clínicos
Sinais vitais
Sono
Atividades
Peso
Composição corporal
Tendências
Insights
```

Sem perder:

- fonte;
- dispositivo;
- aplicação;
- arquivo;
- unidade original;
- valor normalizado;
- qualidade;
- confiança;
- versão;
- histórico de alterações.

O resultado será um repositório pessoal, longitudinal, portável, auditável e independente de fabricante.
