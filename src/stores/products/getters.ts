import { type Ref, computed } from "vue";
import { type ProductItemType } from "@/types/products";

interface StateType {
  products: Ref<ProductItemType[]>;
  searchQuery: Ref<string>;
  filterCategory: Ref<string>;
  sortBy: Ref<string>;
  sortOrder: Ref<"asc" | "desc">;
}

export const getters = (state: StateType) => {
  const { products, searchQuery, filterCategory, sortBy, sortOrder } = state;

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
      const valueA = a[sortBy.value as keyof ProductItemType]?.toString().toLowerCase() ?? "";
      const valueB = b[sortBy.value as keyof ProductItemType]?.toString().toLowerCase() ?? "";

      if (sortOrder.value === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  });

  const categories = computed<string[]>(() => [...new Set(products.value.map((p) => p.Category))]);

  return {
    filteredProducts,
    categories,
  };
};
