import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";

export function createAzureCredential() {
  const managedIdentityClientId = process.env.AZURE_CLIENT_ID?.trim();
  const isAzureHosted =
    process.env.CONTAINER_APP_NAME !== undefined ||
    process.env.WEBSITE_SITE_NAME !== undefined ||
    process.env.NODE_ENV === "production";

  if (isAzureHosted) {
    return managedIdentityClientId
      ? new ManagedIdentityCredential(managedIdentityClientId)
      : new ManagedIdentityCredential();
  }

  return new DefaultAzureCredential(
    managedIdentityClientId ? { managedIdentityClientId } : undefined,
  );
}
