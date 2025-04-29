<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useProductsStore } from "../stores/products";
import { type ProductItemType } from "@/types/products";

// props
const props = defineProps<{
  product: ProductItemType | null;
}>();

// emits
const emit = defineEmits(["close", "save"]);

// store
const productsStore = useProductsStore();

// data
const localProduct = ref<ProductItemType>({
  Title: "",
  Description: "",
  Category: "test",
  Price: null,
  Image: "",
  C_OR_R: "T",
});

// computed
const saveButtonDisabled = computed(() => {
  return (
    localProduct.value.Image.length > 50 ||
    (localProduct.value.Price !== null && localProduct.value.Price < 0)
  );
});

// watch
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      localProduct.value = { ...newProduct, Category: "test", C_OR_R: "T" };
    } else {
      localProduct.value = {
        Title: "",
        Description: "",
        Category: "test",
        Price: null,
        Image: "",
        C_OR_R: "T",
      };
    }
  },
  { immediate: true }
);

// methods
const saveProduct = () => {
  if (localProduct.value.Id) {
    productsStore.updateProduct({ ...localProduct.value });
  } else {
    productsStore.addProduct(localProduct.value);
  }
  emit("save");
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ localProduct.Id ? "Edit" : "Add" }} Product</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="localProduct.Title"
            type="text"
            class="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Price</label>
          <input
            v-model.number="localProduct.Price"
            type="number"
            min="0"
            class="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            :class="{ 'border-red-500': localProduct.Price !== null && localProduct.Price < 0 }"
            required
          />
          <p
            v-if="localProduct.Price !== null && localProduct.Price < 0"
            class="mt-1 text-sm text-red-600"
          >
            Price cannot be negative
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Image</label>
          <input
            v-model="localProduct.Image"
            type="text"
            class="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            :class="{ 'border-red-500': localProduct.Image.length > 50 }"
            required
          />
          <p v-if="localProduct.Image.length > 50" class="mt-1 text-sm text-red-600">
            Image URL must not exceed 50 characters
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="localProduct.Description"
            rows="3"
            class="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          ></textarea>
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
          :disabled="saveButtonDisabled"
          @click="saveProduct"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
