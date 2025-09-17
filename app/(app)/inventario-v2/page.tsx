import { cookies } from "next/headers";
import { parseAndTransformProducts } from "@/lib/api/schemas/inventory";
import InventoryClient from "@/components/inventory/InventoryClient";

async function getProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory`, {
        headers: { cookie: cookies().toString() },
        next: { tags: ["inventory"] },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch inventory data.");
    }

    const payload = await res.json();
    return parseAndTransformProducts(payload);
}

export default async function InventoryV2Page() {
    const initialProducts = await getProducts();
    return <InventoryClient fallbackData={initialProducts} />;
}
