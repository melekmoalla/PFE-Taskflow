import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useOrganizationList } from "@clerk/clerk-react";

export const OrgControl = () => {
    const params = useParams();
    const { userMemberships, setActive, isLoaded } = useOrganizationList({ userMemberships: { infinite: true, }, });
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {

        if (!setActive || !isLoaded || userMemberships.isLoading) return;

        if (!userMemberships.isLoading) {
            const orgId = params.organizationId;
            const isMember = userMemberships.data?.some(
                (membership) => membership.organization.id === orgId
            );
            // console.log(userMemberships);

            if (!isMember) {
                setNotFound(true); // trigger redirect in render
                return;
            }

            setActive({ organization: orgId });

        }
    }, [isLoaded, userMemberships.isLoading, setActive, params.organizationId]);

    if (notFound) {
        return <Navigate to="/select-org" replace />;
    }

    return null;
};
