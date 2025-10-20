export function parsePagination(searchParams: URLSearchParams) {
	const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
	const pageSize = Math.min(48, Math.max(1, Number(searchParams.get("pageSize") ?? 12) || 12));
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;
	return { page, pageSize, from, to };
}
