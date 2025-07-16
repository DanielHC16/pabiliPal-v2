import {create} from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// For development, use the local server URL
// For production, use the deployed server URL
const BASE_URL = import.meta.env.mode === "development" ? "http://localhost:3000": ""

export const useProductStore = create((set, get) => ({
    // products state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,



    // form state
    formData: {
        name: '',
        price: '',
        image: ''
    },

    setFormData: (formData) => set({ formData }),
    
    resetForm: async(e) => {
        e.preventDefault();
    },

    addProduct: async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        set({ loading: true});

        try {
          const {formData} = get();
          await axios.post(`${BASE_URL}/api/products`, formData);
          await get().fetchProducts(); // Refresh products after adding
          get().resetForm();
          toast.success("Product added successfully.");
          document.getElementById('add_product_modal').close(); // Close modal after adding
        } catch (error) {
            console.log("Error adding product:", error);
            toast.error("An error occurred while adding the product.");
        } finally {
            set({ loading: false });
        }
    },

    fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (error) {
      if (error.status == 429) set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({
                products: prev.products.filter(product => product.id !== id)
            }));
            toast.success("Product deleted successfully.");
        } catch (error) {
            console.log("Error deleting product:", error);
            toast.error("An error occurred while deleting the product.");
        } finally {
            set({ loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data,
                formData: response.data.data, 
                error: null,
             });
        } catch (error) {
            console.log("Error fetching product:", error);
            set({ error: "Something went wrong", currentProduct: null });
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id) => {
        set({ loading: true });
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data});
            toast.success("Product updated successfully.");
        } catch (error) {
            toast.error("An error occurred while updating the product.");
            console.log("Error updating product:", error);
        } finally {
            set({ loading: false });
        }
    }


}));



