import { OrganizationList } from '@clerk/clerk-react';

export default function CreateOrganizationPage() {
    return (
        <>
            <OrganizationList hidePersonal afterCreateOrganizationUrl= "/organization/:id" 
            afterSelectOrganizationUrl= "/organization/:id"/>
        </>
    );
};
