'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * SessionPersistence Component
 * 
 * Handles client-side session recovery and persistence flags.
 * This is crucial for Android WebViews where cookies might not be
 * as reliable as standard browsers.
 */
export default function SessionPersistence() {
    const { status, data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Set persistence flag when authenticated
        if (status === 'authenticated' && session?.user) {
            if (localStorage.getItem('cg_session_active') !== 'true') {
                console.log('🛡️ Session authenticated, setting persistence flag');
                localStorage.setItem('cg_session_active', 'true');
                localStorage.setItem('cg_last_user', session.user.email);
            }
        }

        // 2. Handle Login Persistence (Redirection)
        // If user lands on Home (/) or Login (/login) but has an active session flag
        // we force a check/redirect to dashboard
        const isLandingOrLogin = pathname === '/' || pathname === '/login';
        const hasPersistenceFlag = localStorage.getItem('cg_session_active') === 'true';

        if (isLandingOrLogin && hasPersistenceFlag && status === 'unauthenticated') {
            console.log('🛡️ Potential session detected via flag, attempting recovery...');

            // Safety: Only attempt recovery once per page load to avoid loops
            if (!window.__cg_recovery_tried) {
                window.__cg_recovery_tried = true;
                window.location.href = '/dashboard';
            }
        }

        // 3. Clear flag if user manually logged out (handled in Sidebar, but safety here)
        // Note: We don't clear purely on 'unauthenticated' because that could be a temporary loading state
        // We only clear if they were logged in and now they are definitely NOT.
    }, [status, session, pathname]);

    return null;
}
