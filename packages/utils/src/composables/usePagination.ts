import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const setTotal = (newTotal: number) => {
    total.value = newTotal
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setTotal,
  }
}
