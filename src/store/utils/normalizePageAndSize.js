export default function normalizePageAndSize(payload) {
  if (!payload.size || !payload.page)
    return { normalizedPageSize: 10, normalizedPage: 0 };

  const storedPage = Number.parseInt(payload.page, 10);
  const storedPageSize = Number.parseInt(payload.size, 10);

  const normalizedPage =
    Number.isNaN(storedPage) || storedPage < 0 ? 0 : storedPage;
  const normalizedPageSize = Number.isNaN(storedPageSize)
    ? 10
    : Math.max(storedPageSize, 1);
  return { normalizedPageSize, normalizedPage };
}
