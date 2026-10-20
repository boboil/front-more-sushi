/** Назад по історії, якщо прийшли з нашого сайту, інакше — на fallback */
export function useGoBack(fallback = '/menu') {
  const router = useRouter()
  return () => {
    if (import.meta.client && window.history.state?.back) router.back()
    else navigateTo(fallback)
  }
}
