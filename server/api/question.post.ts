interface QuestionBody {
  name?: string
  email?: string
  question?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Форма зворотного зв'язку → /api/shop/add-question
export default defineEventHandler(async (event) => {
  const body = await readBody<QuestionBody>(event)
  const fields = {
    name: body?.name?.trim().slice(0, 255) ?? '',
    email: body?.email?.trim().slice(0, 255) ?? '',
    question: body?.question?.trim().slice(0, 5000) ?? '',
  }

  const errors: Record<string, string> = {}
  if (!fields.name) errors.name = 'Вкажіть ім\'я'
  if (!EMAIL_RE.test(fields.email)) errors.email = 'Вкажіть коректний e-mail'
  if (!fields.question) errors.question = 'Напишіть повідомлення'
  if (Object.keys(errors).length) throw createError({ statusCode: 422, data: { errors } })

  try {
    await $fetch(backendUrl('add-question'), { method: 'POST', body: { fields } })
    return { ok: true }
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Question backend error' })
  }
})
