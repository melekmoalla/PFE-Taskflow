
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from '@clerk/clerk-react';


export type Organization = {
    id: string;
    slug: string;
    imageUrl: string;
    name: string;
}

interface NavItemProps {
    organization: any;
    isActive: boolean;
    isExpanded: boolean;
    onExpand: (id: string) => void;
}

export const NavItem = ({ organization, isActive, isExpanded, onExpand }: NavItemProps) => {
    const navigate = useNavigate();
    const { membership } = useOrganization();
    const role = membership?.role;

    const routes = [
        {
            label: "Boards",
            icon: <Layout className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}`,
        },
        {
            label: "Activity",
            icon: <Activity className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/settings`,
        },
        {
            label: "Billing",
            icon: <CreditCard className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/billing`,
        },
    ];

    const onClick = (href: string) => {
        console.log(`Navigating to: ${href}`);  // Check the href value
        navigate(href);
    };

    return (
        <AccordionItem value={organization.id} className="border-none">
            <AccordionTrigger
                onClick={() => onExpand(organization.id)}
                className={cn(
                    "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
                    isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
                )}
            >
                <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 relative">
                        <img
                            src={organization.imageUrl}
                            alt="Organization image"
                            className="rounded-sm object-cover"
                        />
                    </div>
                    <span className="font-medium text-sm">{organization.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
                {routes.map((route) => {
    
                    if (route.label === 'Billing' && role !== 'org:admin') {
                        return null;
                    }

                    return (
                        <Button
                            size="sm"
                            key={route.href}
                            onClick={() => onClick(route.href)}
                            className={cn(
                                "w-full font-normal justify-start pl-10 mb-1",
                                window.location.pathname === route.href && "bg-sky-500/10 text-sky-700"
                            )}
                            variant="ghost"
                        >
                            {route.icon}
                            {route.label}
                        </Button>
                    );
                })}

            </AccordionContent>
        </AccordionItem>

    );
};

NavItem.Skeleton = function SkeletonNavItem() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className="h-full w-full absolute" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
};