
export default async function fetchAttachment(cardId: string, orgId: string, apiRequest: any) {
    const data = await apiRequest(`/api/board/card/Attachment/?cardId=${cardId}&orgId=${orgId}`, {}, "GET");
    return data;
}
