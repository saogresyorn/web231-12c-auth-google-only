import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main>
      <h1>Confirm Deletion</h1>
      <p>Are you sure you want to delete "{product.name}"?</p>
      <div>
        <form action={deleteAction}>
          <button type="submit">Confirm Delete</button>
        </form>
        <Link href="/">Cancel</Link>
      </div>
    </main>
  );
}