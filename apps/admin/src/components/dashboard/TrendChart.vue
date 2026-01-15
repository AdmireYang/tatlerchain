<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, onActivated } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface ChartData {
  labels: string[]
  values: number[]
  name?: string
}

interface Props {
  data: ChartData
  type?: 'line' | 'bar'
  height?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  height: '300px',
  color: '#409eff',
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)

  // 配置选项
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.labels,
      boundaryGap: props.type === 'bar',
      axisLine: {
        lineStyle: {
          color: '#e4e7ed',
        },
      },
      axisLabel: {
        color: '#606266',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#606266',
      },
      splitLine: {
        lineStyle: {
          color: '#e4e7ed',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: props.data.name || '数据',
        type: props.type,
        data: props.data.values,
        smooth: props.type === 'line',
        itemStyle: {
          color: props.color,
        },
        areaStyle:
          props.type === 'line'
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: props.color + '40',
                    },
                    {
                      offset: 1,
                      color: props.color + '00',
                    },
                  ],
                },
              }
            : undefined,
      },
    ],
  }

  chartInstance.setOption(option)
}

const resizeChart = () => {
  chartInstance?.resize()
}

// 暴露 resize 方法供父组件调用
defineExpose({
  resize: resizeChart,
})

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
})

onActivated(() => {
  // 当组件被激活时（如标签页切换），重新调整尺寸
  nextTick(() => {
    resizeChart()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据变化
watch(
  () => props.data,
  () => {
    nextTick(() => {
      initChart()
    })
  },
  { deep: true }
)

// 监听类型变化
watch(
  () => props.type,
  () => {
    nextTick(() => {
      initChart()
    })
  }
)
</script>

<style scoped lang="scss">
.trend-chart {
  width: 100%;
  height: v-bind(height);
}
</style>
