"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import Barcode from "react-barcode";
import {
  getProducts,
  addProduct,
  deleteProduct,
  Product,
} from "@/services/productService";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "./ConfirmDialog";

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ConfirmModal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleAdd = async () => {
    if (input.length == 19) {
      try {
        setLoading(true);
        await addProduct(input);
        const products = await getProducts();
        setProducts(products.data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
      }
    }
  };

  const handleDelete = (product_id: string) => {
    setConfirmOpen(true);
    setSelectedProduct(product_id);
  };

  const handleConfirmModal = async () => {
    try {
      if (selectedProduct != null) {
        setLoading(true);
        await deleteProduct(selectedProduct as string);
        const products = await getProducts();

        setProducts(products.data);
        setLoading(false);
        setConfirmOpen(false);
      }
    } catch (error: any) {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Z0-9]/g, "");
    let formatted = value.match(/.{1,4}/g)?.join("-") ?? value;
    if (formatted.length <= 19) {
      setInput(formatted);
    }
  };

  const init = async () => {
    setLoading(true);
    const products = await getProducts();
    setProducts(products.data);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Box p={4}>
      <Box display="flex" gap={2} mb={4}>
        <TextField
          label="รหัสสินค้า"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          ADD
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ opacity: loading ? 0.5 : 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#00AEEF" }}>
              <TableCell align="center" sx={{ border: '1px solid black', color: "white" }}>
                Id
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid black', color: "white" }}>
                รหัสสินค้า (16 หลัก)
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid black', color: "white" }}>
                บาร์โค้ดสินค้า
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid black', color: "white" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ border: '1px solid black', verticalAlign: "middle" }}>
                    {product.id}
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black', verticalAlign: "middle" }}>
                    {product.product_id}
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black', verticalAlign: "middle" }}>
                    <Box display="flex" justifyContent="center">
                      <Barcode
                        value={product.product_id}
                        height={40}
                        width={1}
                        fontSize={12}
                        format="CODE39"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black', verticalAlign: "middle" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  ไม่พบข้อมูลสินค้าddd
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <CircularProgress />
        </Box>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={() => handleConfirmModal()}
        title="ยืนยันการลบสินค้า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?"
      />
    </Box>
  );
};

export default ProductTable;
