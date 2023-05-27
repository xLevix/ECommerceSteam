import React, { ReactNode } from 'react';
import { HeaderResponsive } from './Header'; // ścieżka do twojego pliku HeaderResponsive

const links = [
    { link: '/featured', label: 'Featured' },
    { link: '/search', label: 'Search' },
    { link: '/login', label: 'Login' },
];

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <HeaderResponsive links={links} />
            {children}
        </>
    );
}
