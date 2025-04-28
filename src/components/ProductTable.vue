<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductForm from './ProductForm.vue'

// store
const productsStore = useProductsStore()

// data
const showModal = ref(false)
const selectedProduct = ref(null)

// computed
const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (value) => productsStore.setSearchQuery(value),
})
const loading = computed(() => productsStore.loading)
const products = computed(() => productsStore.filteredProducts)

// methods
const filterCategory = computed({
  get: () => productsStore.filterCategory,
  set: (value) => productsStore.setFilterCategory(value),
})

const openAddModal = () => {
  selectedProduct.value = { name: '', category: '', price: 0 }
  showModal.value = true
}

const openEditModal = (product) => {
  selectedProduct.value = { ...product }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const deleteProduct = (id) => {
  productsStore.deleteProduct(id)
}

const sortBy = (field) => {
  if (productsStore.sortBy === field) {
    productsStore.toggleSortOrder()
  } else {
    productsStore.setSortBy(field)
    productsStore.sortOrder = 'asc'
  }
}

const sortIndicator = (field) => {
  if (productsStore.sortBy === field) {
    return productsStore.sortOrder === 'asc' ? '↑' : '↓'
  }
  return ''
}

// execution
productsStore.fetchProducts();
</script>
<template>
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          v-model="filterCategory"
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Categories</option>
          <option v-for="category in productsStore.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>
  
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="sortBy('Title')"
              >
                Name {{ sortIndicator('Title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    {{ loading }}
                    <div class="flex justify-center items-center">
                        <svg class="animate-spin h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading products...
                    </div>
                </td>
            </tr>
            <tr v-else-if="!productsStore.loading && products.length === 0">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No products found
                </td>
            </tr>
            <tr v-else v-for="product in products" :key="product.Id">
              <td class="px-6 py-4 whitespace-nowrap">{{ product.Title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ product.Category }}</td>
              <td class="px-6 py-4 whitespace-nowrap">${{ product.Price?.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  @click="openEditModal(product)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product.Id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <ProductForm
        v-if="showModal"
        :product="selectedProduct"
        @close="closeModal"
        @save="closeModal"
      />
    </div>
  </template>
  
