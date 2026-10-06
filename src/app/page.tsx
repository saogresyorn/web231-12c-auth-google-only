import Link from "next/link";
import { auth } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif", color: "#333" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eaeaea", paddingBottom: "20px", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#111" }}>Product Store[cite: 1]</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>Manage your products with secure authentication[cite: 1]</p>
        </div>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <div style={{ display: "grid", gap: "20px" }}>
        {products.map((product) => (
          <article 
            key={product.id} 
            data-testid="product"
            style={{ 
              background: "#fff", 
              border: "1px solid #e1e4e8", 
              borderRadius: "8px", 
              padding: "20px", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#24292e" }}>{product.name}[cite: 1]</h2>
              <p style={{ margin: "0 0 12px 0", color: "#586069", lineHeight: "1.5" }}>{product.description}[cite: 1]</p>
              <span style={{ fontWeight: "bold", color: "#0366d6", fontSize: "18px" }}>
                ฿{product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}[cite: 1]
              </span>
            </div>

            {isLoggedIn && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Link 
                  href={`/products/${product.id}/edit`}
                  style={{ 
                    padding: "6px 12px", 
                    background: "#f1f8ff", 
                    color: "#0366d6", 
                    border: "1px solid #c8e1ff", 
                    borderRadius: "6px", 
                    textDecoration: "none", 
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Edit[cite: 1]
                </Link>
                <Link 
                  href={`/products/${product.id}/delete`}
                  style={{ 
                    padding: "6px 12px", 
                    background: "#ffeef0", 
                    color: "#d73a49", 
                    border: "1px solid #ffdce0", 
                    borderRadius: "6px", 
                    textDecoration: "none", 
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Delete[cite: 1]
                </Link>
              </div>
            )}
          </article>
        ))}

        {products.length === 0 && (
          <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>No products available[cite: 1]</p>
        )}
      </div>
    </main>
  );
}
