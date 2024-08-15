import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate, shopifyClient } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    const { session } = await authenticate.admin(request);

    const body = await request.formData();
    const { productId, newtitle } = Object.fromEntries(body);
    const id = Number(productId.split("/").pop());
    const client = new shopifyClient.clients.Rest({ session });
    const response = await client.put({
      path: `products/${id}`,
      data: {
        product: {
          title: newtitle,
        },
      },
    });

    // Get the referrer URL from the request headers
    const referrer = request.headers.get("referer") || "/";

    // Redirect back to the referrer page or to a default page
    return redirect('/app');
  }

  // Handle other methods or default cases
  return new Response(null, { status: 405 }); // Method Not Allowed
};
