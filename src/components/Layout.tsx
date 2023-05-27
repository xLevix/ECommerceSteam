import React, { ReactNode } from 'react';
import { HeaderResponsive } from './Header';
import {SteamProfile} from "@/lib/passport";

interface LayoutProps {
    children: ReactNode;
    user: SteamProfile | null;
}

export function Layout({ children, user }: LayoutProps) {
    const links = [
        { link: '/featured', label: 'Featured' },
        { link: '/search', label: 'Search' },
    ];

    return (
        <>
            <HeaderResponsive links={links} user={user} />
            {children}
        </>
    );
}
