"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipProps, LegendProps } from "recharts"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | undefined>(undefined)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// ChartStyle component implementation
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .map(([key, item]) => {
            return `
              [data-chart="${id}"] .recharts-layer [dataKey="${key}"],
              [data-chart="${id}"] .recharts-layer [name="${key}"] {
                fill: ${item.color};
                stroke: ${item.color};
              }
            `
          })
          .join("\n"),
      }}
    />
  )
}

function ChartContainer({
  config,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
}) {
  // Adding unique ID for the chart for styling purposes
  const chartId = React.useId().replace(/:/g, "");

  return (
    <ChartContext.Provider value={{ config }}>
      <div 
        data-chart={chartId} 
        className={className} 
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({ active, payload, label }: TooltipProps<any, any>) {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("ChartTooltipContent must be used within a ChartContainer")
  }

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <div className="grid grid-flow-col gap-2">
        {payload.map((data: any, i: number) => (
          <div key={i} className="flex flex-col">
            <span className="text-xs text-muted-foreground">{data.name}</span>
            <span className="font-bold">{data.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent(props: LegendProps) {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("ChartLegendContent must be used within a ChartContainer")
  }

  const { payload } = props

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {payload?.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: entry.color,
            }}
          />
          <span className="text-xs font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
