<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductsStore } from '../stores/products'
import { type ProductItemType } from '@/types/products'

const props = defineProps<{
  product: ProductItemType | null
}>()

const emit = defineEmits(['close', 'save'])

const productsStore = useProductsStore()
const localProduct = ref<ProductItemType>({
  Id: 0,
  Title: '',
  Description: '',
  Category: '',
  Price: null,
  Image: '',
  C_OR_R: ''
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    localProduct.value = { ...newProduct }
  } else {
    localProduct.value = {
      Id: 0,
      Title: '',
      Description: '',
      Category: '',
      Price: null,
      Image: '',
      C_OR_R: ''
    }
  }
}, { immediate: true })

const saveProduct = () => {
  if (localProduct.value.Id) {
    productsStore.updateProduct({ ...localProduct.value })
  } else {
    productsStore.addProduct(localProduct.value)
  }
  emit('save')
}
</script>

<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ localProduct.Id ? 'Edit' : 'Add' }} Product</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="localProduct.Title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input
              v-model="localProduct.Category"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input
              v-model.number="localProduct.Price"
              type="number"
              step="0.01"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="saveProduct"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
</template>
  
