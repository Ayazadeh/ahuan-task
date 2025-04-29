import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { apis } from "@/server/apis"
import { type ProductItemType } from "@/types/products";
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
  const filteredProducts = computed<ProductItemType[]>(() => {
    let filtered = products.value;

    // search
    if (searchQuery.value) {
      filtered = filtered.filter((product) =>
        product.Title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    // filter
    if (filterCategory.value) {
      filtered = filtered.filter((product) => product.Category === filterCategory.value);
    }

    // sort
    
    filtered = [...filtered].sort((a, b) => {
      const valueA = a[sortBy.value as keyof ProductItemType]?.toString().toLowerCase() ?? '';
      const valueB = b[sortBy.value as keyof ProductItemType]?.toString().toLowerCase() ?? '';
      
      if (sortOrder.value === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filtered;
  });

  const categories = computed<string[]>(() => [...new Set(products.value.map((p) => p.Category))]);

  // actions
  const fetchProducts = async () => {

    loading.value = true;
    error.value = null;

    try {

      const response = await axios.get(apis.products, {
        params: {
          type: 'T',
          cat: 'test'
        }
      });

      products.value = response?.data ?? []

    } catch (err: unknown) {
      error.value = "Failed to fetch products";
      console.error(err);

    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (product: Omit<ProductItemType, "id">) => {

    loading.value = true;
    error.value = null;

    try {

      await axios.post(apis.products, product);

      products.value.push({  ...product });

    } catch (err: unknown) {
      error.value = "Failed to add product";
      console.error(err);
      
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (updatedProduct: ProductItemType) => {

    loading.value = true;
    error.value = null;

    try {
      
      await axios.put(`${apis.products}?id=${updatedProduct.Id}`,
        updatedProduct
      );

      const index = products.value.findIndex((p) => p.Id === updatedProduct.Id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

    } catch (err: unknown) {
      error.value = "Failed to update product";
      console.error(err);

    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id: number) => {

    loading.value = true;
    error.value = null;

    try {

      await axios.delete(apis.products, {
        params: {
          id
        }
      });

      products.value = products.value.filter((p) => p.Id !== id);

    } catch (err: unknown) {
      error.value = "Failed to delete product";
      console.error(err);
      
    } finally {
      loading.value = false;
    }
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setFilterCategory = (category: string) => {
    filterCategory.value = category;
  };

  const setSortBy = (field: string) => {
    sortBy.value = field;
  };

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  };

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
