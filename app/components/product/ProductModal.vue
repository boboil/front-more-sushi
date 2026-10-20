<script setup lang="ts">
const modal = useProductModal()
const { productBySlug } = useMenu()
const route = useRoute()

const product = computed(() => (modal.slug.value ? productBySlug(modal.slug.value) : undefined))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') modal.close()
}

watch(product, (p) => {
  if (import.meta.server) return
  document.documentElement.style.overflow = p ? 'hidden' : ''
  if (p) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

// закриваємо при будь-якій навігації
watch(() => route.fullPath, () => modal.close())
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="product" class="modal" role="dialog" aria-modal="true" :aria-label="product.name">
        <div class="modal__backdrop" @click="modal.close()" />
        <ProductDetails :product="product" in-modal class="modal__card" @close="modal.close()" @added="modal.close()" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
  }

  &__card {
    position: relative;
    box-shadow: $shadow-modal;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;

  .modal__card {
    transition: transform 0.2s;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__card {
    transform: translateY(12px) scale(0.98);
  }
}
</style>
