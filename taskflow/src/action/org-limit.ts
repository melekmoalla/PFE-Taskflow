export const hasAvailableCount_or_getAvailableCount = async (  orgId: string,
  apiRequest: any) => {
    try {
        if (!orgId) {
            throw new Error("Unauthorized.");
        }

        const response = await apiRequest(`/api/board/org-limit/?org=${orgId}`, {}, "GET");
        return response;

    } catch (error) {
        console.error("[CHECK_LIMIT_ERROR]", error);
        return false;
    }
};

export const increaseAvailableCount = async (  orgId: string,
  apiRequest: any) => {
    try {
        if (!orgId) {
            throw new Error("Unauthorized.");
        }
        await apiRequest("/api/board/org-limit/", {
            org: orgId,
            mode: "increase"
        }, "POST");

    } catch (error) {
        console.error("[INCREASE_LIMIT_ERROR]", error);
    }
    return null;
};

export const decreaseAvailableCount = async (  orgId: string,
  apiRequest: any) => {
    try {
        if (!orgId) {
            throw new Error("Unauthorized.");
        }
        await apiRequest("/api/board/org-limit/", {
            org: orgId,
            mode: "decrease"
        }, "POST");

    } catch (error) {
        console.error("[DECREASE_LIMIT_ERROR]", error);
    }
    return null;
};
