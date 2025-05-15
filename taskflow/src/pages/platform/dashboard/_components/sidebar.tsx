

import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react'
import { useOrganization, useOrganizationList } from '@clerk/clerk-react';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { NavItem, Organization } from './navbar-item';


interface SidebarProps {
    storageKey?: string;
}

export const Sidebar = ({
    storageKey = "t-sidebar-state",
}: SidebarProps) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});
    const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization();
    const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({ userMemberships: { infinite: true, }, });
    
    const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
        (acc: string[], key: string) => {
            if (expanded[key]) {
                acc.push(key);
            }
            return acc;
        },
        []
    );

    // console.log(expanded);
    const onExpand = (id: string) => {
        setExpanded((expanded) => ({
            ...expanded,
            [id]: !expanded[id],
        }));
    };



    if (
        !isLoadedOrg ||
        !isLoadedOrgList ||
        userMemberships.isLoading
    )
        return (
            <>
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]" />
                    <Skeleton className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                </div>
            </>
        );

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspaces</span>
                <Button
                    asChild
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                >
                    <Link to="/select-org">
                        <Plus className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type='multiple'
                defaultValue={defaultAccordionValue}
                className='space-y-2'>
                {userMemberships.data.map(({ organization }) => (

                    <NavItem
                        organization={organization as Organization}
                        isActive={organization.id === activeOrganization?.id}
                        isExpanded={expanded[organization.id]}
                        onExpand={onExpand}
                        key={organization.id}
                    />

                ))}
            </Accordion>
        </>
    );
};

