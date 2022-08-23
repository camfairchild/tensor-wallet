import { useEffect, useState } from "react";
export const useLocalStorage = (localStorageKey) => {
    const [localValue, setLocalValue] = useState(localStorage.getItem(localStorageKey) || "");
    useEffect(() => {
        localStorage.setItem(localStorageKey, localValue);
    }, [localValue, localStorageKey]);
    return [localValue, setLocalValue];
};
