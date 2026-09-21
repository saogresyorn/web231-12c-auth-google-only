"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts(products.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)));
      setEditingId(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  const editingProduct = products.find((item) => item.id === editingId) || null;

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>รายการสินค้า</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <button type="button" onClick={() => loadProducts(defaultQuery)} disabled={status === "loading"}>
          {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
        </button>
      </div>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        key={editingId ?? "new"}
        editing={editingProduct}
        onSave={saveProduct}
        onCancel={() => setEditingId(null)}
      />

      <section aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}
        {status === "error" && <p role="alert" style={{ color: "red" }}>{errorMessage}</p>}
        {status === "ready" && products.length === 0 && <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>}
        
        {status === "ready" && products.length > 0 && (
          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => setEditingId(item.id)} style={{ marginRight: "8px" }}>แก้ไข</button>
                    <button onClick={() => removeProduct(item.id)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}