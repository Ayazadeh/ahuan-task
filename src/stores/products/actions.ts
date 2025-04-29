import axios from "axios";
import { apis } from "@/server/apis";
import { type ProductItemType } from "@/types/products";

import { type Ref } from "vue";

interface StateType {
  loading: Ref<boolean>;
  error: Ref<string | null>;
  products: Ref<ProductItemType[]>;
  searchQuery: Ref<string>;
  filterCategory: Ref<string>;
  sortBy: Ref<string>;
  sortOrder: Ref<"asc" | "desc">;
}

export const actions = (state: StateType) => {
  const { loading, error, products, searchQuery, filterCategory, sortBy, sortOrder } = state;

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(apis.products, {
        params: {
          type: "T",
          cat: "test",
        },
      });

      products.value = response?.data ?? [];
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

      fetchProducts();
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
      await axios.put(`${apis.products}?id=${updatedProduct.Id}`, updatedProduct);

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

  const deleteProduct = async (id?: number) => {
    if (!id) return;

    loading.value = true;
    error.value = null;

    try {
      await axios.delete(apis.products, {
        params: {
          id,
        },
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
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchQuery,
    setFilterCategory,
    setSortBy,
    toggleSortOrder,
  };
};
