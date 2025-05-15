export default async function fetchCardById(cardId: string, orgId: string, apiRequest: any) {
    const data = await apiRequest(`/api/board/card/${cardId}/?orgId=${orgId}`, {}, "GET");
    return data;
}
