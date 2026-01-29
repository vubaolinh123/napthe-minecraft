'use client';

import { useState, useCallback, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    initialPage?: number;
    initialItemsPerPage?: number;
}

interface UsePaginationReturn {
    page: number;
    itemsPerPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    setPage: (page: number) => void;
    setItemsPerPage: (count: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    paginate: <T>(items: T[]) => T[];
}

export function usePagination({
    totalItems,
    initialPage = 1,
    initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn {
    const [page, setPageState] = useState(initialPage);
    const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

    const totalPages = useMemo(
        () => Math.ceil(totalItems / itemsPerPage) || 1,
        [totalItems, itemsPerPage]
    );

    const startIndex = useMemo(
        () => (page - 1) * itemsPerPage,
        [page, itemsPerPage]
    );

    const endIndex = useMemo(
        () => Math.min(startIndex + itemsPerPage, totalItems),
        [startIndex, itemsPerPage, totalItems]
    );

    const setPage = useCallback((newPage: number) => {
        setPageState(Math.max(1, Math.min(newPage, totalPages)));
    }, [totalPages]);

    const setItemsPerPage = useCallback((count: number) => {
        setItemsPerPageState(count);
        setPageState(1); // Reset to first page when changing items per page
    }, []);

    const nextPage = useCallback(() => {
        setPage(page + 1);
    }, [page, setPage]);

    const prevPage = useCallback(() => {
        setPage(page - 1);
    }, [page, setPage]);

    const goToFirstPage = useCallback(() => {
        setPageState(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setPageState(totalPages);
    }, [totalPages]);

    const paginate = useCallback(<T,>(items: T[]): T[] => {
        return items.slice(startIndex, endIndex);
    }, [startIndex, endIndex]);

    return {
        page,
        itemsPerPage,
        totalPages,
        startIndex,
        endIndex,
        setPage,
        setItemsPerPage,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
        paginate,
    };
}
