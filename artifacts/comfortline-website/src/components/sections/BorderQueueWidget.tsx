import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, AlertTriangle, Car, Truck, X } from "lucide-react";
import { useGetBorderQueue, getGetBorderQueueQueryKey, getBorderQueue } from "@workspace/api-client-react";
import { useLang } from "@/context/language-context";

const REFETCH_INTERVAL_MS = 3 * 60 * 1000;

const CHECKPOINT_NAMES_EN: Record<string, string> = {
  "Бенякони": "Benyakoni",
  "Берестовица": "Berestovitsa",
  "Брест": "Brest",
  "Брузги": "Bruzgi",
  "Григоровщина": "Grigorovshchina",
  "Каменный Лог": "Kamenny Log",
  "Козловичи": "Kozlovichi",
};

function displayName(name: string, isRu: boolean): string {
  if (isRu) return name;
  return CHECKPOINT_NAMES_EN[name] ?? name;
}

function loadLabel(total: number, isRu: boolean) {
  if (total === 0) {
    return { text: isRu ? "Пусто" : "Empty", className: "text-emerald-400" };
  }
  if (total <= 5) {
    return { text: isRu ? "Свободно" : "Light", className: "text-emerald-400" };
  }
  if (total <= 20) {
    return { text: isRu ? "Умеренно" : "Moderate", className: "text-amber-400" };
  }
  return { text: isRu ? "Загружено" : "Heavy", className: "text-red-400" };
}

type BorderQueueWidgetProps = {
  className?: string;
  size?: "default" | "lg";
  onClose?: () => void;
};

export function BorderQueueWidget({ className = "my-6", size = "default", onClose }: BorderQueueWidgetProps = {}) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const isLg = size === "lg";

  const queryClient = useQueryClient();
  const [isForcing, setIsForcing] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useGetBorderQueue(undefined, {
    query: {
      queryKey: getGetBorderQueueQueryKey(),
      refetchInterval: REFETCH_INTERVAL_MS,
      staleTime: 60_000,
    },
  });

  const handleRefresh = async () => {
    setIsForcing(true);
    try {
      const fresh = await getBorderQueue({ force: true });
      queryClient.setQueryData(getGetBorderQueueQueryKey(), fresh);
    } catch {
      await refetch();
    } finally {
      setIsForcing(false);
    }
  };

  const checkpoints = data?.checkpoints ?? [];
  const showError = (isError || data?.error) && checkpoints.length === 0;
  const receivedAt = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleString(isRu ? "ru-RU" : "en-GB", {
        timeZone: "Europe/Minsk", day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <div className={`relative rounded-2xl border border-primary/30 bg-primary/5 ${isLg ? "p-6 md:p-7" : "p-5 md:p-6"} ${className}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={isRu ? "Закрыть" : "Close"}
          className="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className={`flex items-center justify-between gap-3 mb-4 flex-wrap ${onClose ? "pr-9" : ""}`}>
        <div>
          <h3 className={`font-bold text-foreground ${isLg ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
            {isRu ? "Живая очередь на границе" : "Live border queue"}
          </h3>
          <p className={`text-muted-foreground mt-0.5 ${isLg ? "text-sm" : "text-xs"}`}>
            {isRu ? "Данные Белтаможсервиса · " : "Beltamozhservice data · "}
            <a href="https://mon.declarant.by/#/zone" target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary">mon.declarant.by</a>
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isFetching || isForcing}
          className={`inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 shrink-0 ${isLg ? "text-sm" : "text-xs"}`}
        >
          <RefreshCw className={`${isLg ? "h-4 w-4" : "h-3.5 w-3.5"} ${isFetching || isForcing ? "animate-spin" : ""}`} />
          {isRu ? "Обновить" : "Refresh"}
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          {isRu ? "Загрузка данных…" : "Loading data…"}
        </p>
      )}

      {showError && (
        <div className="flex items-start gap-2 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            {isRu
              ? "Не удалось получить актуальные данные. "
              : "Live data is temporarily unavailable. "}
            <a href="https://mon.declarant.by/#/zone" target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2">
              {isRu ? "Проверить очередь на официальном сайте" : "Check the official queue monitor"}
            </a>
          </span>
        </div>
      )}

      {!isLoading && !showError && checkpoints.length > 0 && (
        <>
          {(data?.updatedAt || receivedAt) && (
            <p className={`text-muted-foreground mb-3 ${isLg ? "text-sm" : "text-xs"}`}>
              {data?.updatedAt
                ? (isRu ? "По состоянию на: " : "Source updated: ")
                : (isRu ? "Данные запрошены: " : "Data requested: ")}
              {data?.updatedAt || receivedAt}
              {data?.stale && (isRu ? " (кэш — данные могут устареть)" : " (cached — may be outdated)")}
            </p>
          )}

          {/* Compact stacked list — used on narrow screens so nothing is clipped off-screen */}
          <div className={`divide-y divide-border/50 ${isLg ? "sm:hidden" : "min-[420px]:hidden"}`}>
            {checkpoints.map((cp) => {
              const load = loadLabel(cp.total, isRu);
              return (
                <div key={cp.name} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-foreground font-medium truncate ${isLg ? "text-sm" : "text-xs"}`}>
                      {displayName(cp.name, isRu)}
                    </p>
                    <p className={`flex items-center gap-2.5 text-muted-foreground mt-1 ${isLg ? "text-xs" : "text-[11px]"}`}>
                      <span className="inline-flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {cp.cars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {cp.trucks}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-foreground font-semibold ${isLg ? "text-sm" : "text-xs"}`}>{cp.total}</p>
                    <p className={`font-semibold mt-0.5 ${load.className} ${isLg ? "text-xs" : "text-[11px]"}`}>
                      {load.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full table — used once there is enough horizontal room */}
          <div className={`overflow-x-auto -mx-1 ${isLg ? "hidden sm:block" : "hidden min-[420px]:block"}`}>
            <table className={`w-full ${isLg ? "text-sm md:text-base min-w-[480px]" : "text-xs md:text-sm min-w-[440px]"}`}>
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className={`text-left font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                    {isRu ? "КПП" : "Checkpoint"}
                  </th>
                  <th className={`text-center font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                    <Car className={isLg ? "h-4 w-4 inline" : "h-3.5 w-3.5 inline"} />
                  </th>
                  <th className={`text-center font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                    <Truck className={isLg ? "h-4 w-4 inline" : "h-3.5 w-3.5 inline"} />
                  </th>
                  <th className={`text-center font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                    {isRu ? "Всего" : "Total"}
                  </th>
                  <th className={`text-right font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                    {isRu ? "Статус" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkpoints.map((cp) => {
                  const load = loadLabel(cp.total, isRu);
                  return (
                    <tr key={cp.name} className="border-b border-border/50 last:border-0">
                      <td className={`text-foreground font-medium ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                        {displayName(cp.name, isRu)}
                      </td>
                      <td className={`text-center text-foreground/85 ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>{cp.cars}</td>
                      <td className={`text-center text-foreground/85 ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>{cp.trucks}</td>
                      <td className={`text-center text-foreground/85 font-semibold ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                        {cp.total}
                      </td>
                      <td className={`text-right font-semibold ${load.className} ${isLg ? "py-2.5 px-2" : "py-2 px-1"}`}>
                        {load.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className={`text-muted-foreground mt-3 ${isLg ? "text-xs" : "text-[11px]"}`}>
            {isRu
              ? "Время указано по UTC+3, переход на летнее время не учитывается"
              : "Times are UTC+3 and do not observe Daylight Saving Time"}
          </p>
        </>
      )}
    </div>
  );
}
