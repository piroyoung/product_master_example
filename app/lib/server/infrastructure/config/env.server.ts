export class ServerConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerConfigurationError";
  }
}

export type SearchServiceConfig = {
  endpoint: string;
  indexName: string;
};

export function getSearchServiceConfig(): SearchServiceConfig {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT?.trim();

  if (!endpoint) {
    throw new ServerConfigurationError(
      "AZURE_SEARCH_ENDPOINT is required to query Azure AI Search.",
    );
  }

  return {
    endpoint,
    indexName: process.env.AZURE_SEARCH_INDEX_NAME?.trim() || "products",
  };
}
