import { useEffect, useRef } from "react";
export const useIsMountedRef = () => {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
};
