"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { asset: "Real Estate", value: 275000, fill: "var(--color-realEstate)" },
  { asset: "Stocks", value: 200000, fill: "var(--color-stocks)" },
  { asset: "Crypto", value: 287000, fill: "var(--color-crypto)" },
  { asset: "Cash", value: 125000, fill: "var(--color-cash)" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  realEstate: {
    label: "Real Estate",
    color: "hsl(var(--chart-1))",
  },
  stocks: {
    label: "Stocks",
    color: "hsl(var(--chart-2))",
  },
  crypto: {
    label: "Crypto",
    color: "hsl(var(--chart-3))",
  },
  cash: {
    label: "Cash",
    color: "hsl(var(--chart-4))",
  },
}

export function AssetChart() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="asset"
          innerRadius={50}
          strokeWidth={5}
          outerRadius={90}
        >
           {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="asset" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  )
}
