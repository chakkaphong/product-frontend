import api from '@/lib/axios';

const API_URL = 'v1/products'; // no need to include /api since baseURL handles it


export interface Product {
  id: number;
  product_id: string;
}


export interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}



export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const addProduct = async (productCode: string) => {
  const res = await api.post(API_URL, { product_id: productCode });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};
