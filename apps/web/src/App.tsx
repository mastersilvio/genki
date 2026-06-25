import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Database,
  HeartPulse,
  Import,
  MoonStar,
  Scale,
  Watch,
} from "lucide-react";
import { getHealth } from "./api";

const navigation = [
  ["Hoje", HeartPulse],
  ["Saúde", Activity],
  ["Sono", MoonStar],
  ["Atividades", CalendarDays],
  ["Corpo", Scale],
  ["Importações", Import],
  ["Dispositivos", Watch],
] as const;

const cards = [
  {
    label: "Passos",
    value: "8.421",
    detail: "84% da meta diária",
    icon: Activity,
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Sono",
    value: "7h 42",
    detail: "Regularidade em alta",
    icon: MoonStar,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    label: "Peso",
    value: "78,4 kg",
    detail: "−0,6 kg em 30 dias",
    icon: Scale,
    color: "bg-amber-100 text-amber-800",
  },
] as const;

export function App() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    retry: 1,
    refetchInterval: 30_000,
  });

  return (
    <div className="min-h-screen bg-[#f2f5ef] text-[#17342f]">
      <div className="mx-auto flex min-h-screen max-w-[1480px]">
        <aside className="hidden w-64 flex-col border-r border-[#dce5dc] bg-[#082c26] p-6 text-white lg:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#b8ee74] text-xl font-black text-[#082c26]">
              元
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Genki</p>
              <p className="text-xs text-emerald-100/70">Saúde, com memória</p>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Navegação principal">
            {navigation.map(([label, Icon], index) => (
              <button
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-white/12 text-white"
                    : "text-emerald-50/70 hover:bg-white/8 hover:text-white"
                }`}
                key={label}
                type="button"
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 text-emerald-100">
              <Database size={16} />
              Fundação ativa
            </div>
            <p className="text-xs leading-relaxed text-emerald-50/60">
              Dados sintéticos. Nenhuma integração externa está habilitada.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-12">
          <header className="mb-10 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-[#54736c]">
                Quinta-feira, 25 de junho
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Bom dia, Sílvio.
              </h1>
              <p className="mt-3 max-w-xl text-[#617b75]">
                Sua linha do tempo está pronta para receber dados de diferentes
                dispositivos, sem perder a origem.
              </p>
            </div>
            <div
              className={`mt-1 flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${
                health.isSuccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : health.isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <span className="size-2 rounded-full bg-current" />
              {health.isSuccess
                ? "API conectada"
                : health.isError
                  ? "API desconectada"
                  : "Verificando API"}
            </div>
          </header>

          <section
            className="grid gap-4 md:grid-cols-3"
            aria-label="Resumo de hoje"
          >
            {cards.map(({ label, value, detail, icon: Icon, color }) => (
              <article
                className="rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-[0_12px_40px_rgba(25,61,52,0.06)] backdrop-blur"
                key={label}
              >
                <div className="mb-7 flex items-start justify-between">
                  <div className={`rounded-2xl p-3 ${color}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="text-[#8aa098]" size={18} />
                </div>
                <p className="text-sm font-medium text-[#668078]">{label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="mt-2 text-sm text-[#7c918b]">{detail}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <article className="rounded-[1.5rem] bg-[#103e35] p-7 text-white shadow-[0_18px_50px_rgba(8,44,38,0.15)]">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100/65">Linha do tempo</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Uma base contínua
                  </h2>
                </div>
                <CalendarDays className="text-[#b8ee74]" />
              </div>
              <div className="relative grid grid-cols-4 gap-3 before:absolute before:left-[12%] before:right-[12%] before:top-3 before:h-px before:bg-white/20">
                {["Mi Band", "Galaxy", "Apple", "Garmin"].map(
                  (device, index) => (
                    <div className="relative text-center" key={device}>
                      <span
                        className={`mx-auto mb-4 block size-6 rounded-full border-4 border-[#103e35] ${
                          index === 3 ? "bg-[#b8ee74]" : "bg-emerald-100/50"
                        }`}
                      />
                      <p className="text-sm font-medium">{device}</p>
                      <p className="mt-1 text-xs text-emerald-100/50">
                        {2018 + index * 2}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/80 bg-white/75 p-7 shadow-[0_12px_40px_rgba(25,61,52,0.06)]">
              <p className="text-sm text-[#668078]">Estado da plataforma</p>
              <h2 className="mt-1 text-xl font-semibold">Fases 0 e 1</h2>
              <ul className="mt-6 space-y-4 text-sm">
                {[
                  "Modelo canônico independente",
                  "Procedência preservada",
                  "Importação idempotente",
                  "Autenticação local",
                ].map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <span className="grid size-6 place-items-center rounded-full bg-[#dff4c2] text-xs text-[#245b33]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
