import { defineStore } from "pinia";
import { ref } from "vue";
import { type ProductItemType } from "@/types/products";
import { actions } from "./actions";
import { getters } from "./getters";

export const useProductsStore = defineStore("products", () => {
  // state
  const products = ref<ProductItemType[]>([]);
  const searchQuery = ref<string>("");
  const filterCategory = ref<string>("");
  const sortBy = ref<string>("Title");
  const sortOrder = ref<"asc" | "desc">("asc");
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // getters
  const { filteredProducts, categories } = getters({
    products,
    searchQuery,
    filterCategory,
    sortBy,
    sortOrder,
  });

  // actions
  const {
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery,
    setFilterCategory,
    setSortBy,
    toggleSortOrder,
  } = actions({ products, searchQuery, filterCategory, sortBy, sortOrder, loading, error });

  return {
    products,
    searchQuery,
    filterCategory,
    sortBy,
    sortOrder,
    loading,
    error,
    filteredProducts,
    categories,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery,
    setFilterCategory,
    setSortBy,
    toggleSortOrder,
  };
});
