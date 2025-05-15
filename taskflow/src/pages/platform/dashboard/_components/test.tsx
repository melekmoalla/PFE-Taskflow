import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Organization } from "@/types";
import { Activity, CreditCard, Layout, Settings } from "lucide-react"; // Ensure Image is available if using Next.js, otherwise use a regular <img>
import { useNavigate } from "react-router-dom";  // React Router for navigation in plain React

export interface Organization {
  organization: Organization;
  isActive: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  organization,
  isActive,
  isExpanded,
  onExpand,
}: Organization) => {
  const history = useNavigate();  // Using React Router for navigation
  const routes = [
    { label: "Boards", icon: <Layout className="h-4 w-4 mr-2" />, href: `/organization/${organization.id}` },
    { label: "Activity", icon: <Activity className="h-4 w-4 mr-2" />, href: `/organization/${organization.id}/activity` },
    { label: "Settings", icon: <Settings className="h-4 w-4 mr-2" />, href: `/organization/${organization.id}/settings` },
    { label: "Billing", icon: <CreditCard className="h-4 w-4 mr-2" />, href: `/organization/${organization.id}/billing` },
  ];

  const onClick = (href: string) => {
    
    history(href);  // Use React Router's push method to navigate
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
        {routes.map((route) => (
          <Button
            key={route.label}
            onClick={() => onClick(route.href)}
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1",
              window.location.pathname === route.href && "bg-sky-500/10 text-sky-700"
            )}
            variant="ghost"
          >
            {route.label}
          </Button>
        ))}
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

