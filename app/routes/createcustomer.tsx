import { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { json } from '@remix-run/node';
import { registerCustomer } from "../register.server";
export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "PUT") {
    const {admin} = await authenticate.admin(request);
    return registerCustomer(request,admin.graphql);
  }

    return json({ message: "Method not allowed" }, { status: 405 });
};
