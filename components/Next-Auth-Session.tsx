"use client"

import React from 'react'

import type { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';

interface IProvidersProps {
    children: React.ReactNode;
    session: Session | null;
}


const NextAuthSession = ({
    children, session
}: IProvidersProps) => {
    return (
        <div>
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </div>
    )
}

export default NextAuthSession
