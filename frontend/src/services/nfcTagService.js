import { apiRequest, endpoints } from "./apiClient.js";

export function getNfcTags() {
  return apiRequest(endpoints.nfcTags);
}

export function assignNfcTag(payload, tagId = null) {
  return apiRequest(tagId ? `${endpoints.nfcTags}${tagId}/` : endpoints.nfcTags, {
    method: tagId ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });
}
