import type { Route } from "./+types/api.products.search";

import { ServerConfigurationError } from "~/lib/server/infrastructure/config/env.server";
import { searchProductsWithDefaultDependencies } from "~/lib/server/infrastructure/product-search-dependencies.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const topParameter = url.searchParams.get("top");
  const top = topParameter === null ? undefined : Number(topParameter);

  try {
    const result = await searchProductsWithDefaultDependencies({ query, top });

    return Response.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Product search request failed.", error);

    if (error instanceof ServerConfigurationError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      { error: "Azure AI Search product query failed." },
      { status: 500 },
    );
  }
}
