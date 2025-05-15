import OrganizationIdLayout from "./organizationId/layout-organizationID";
import { Sidebar } from "../_components/sidebar";

const Organizationlayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max+w+screen-xl mx-auto">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar />
                </div>
                <OrganizationIdLayout>{children}</OrganizationIdLayout>
            </div>
        </main>
    );
}

export default Organizationlayout
