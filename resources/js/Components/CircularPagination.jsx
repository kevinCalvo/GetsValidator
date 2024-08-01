import React, { useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CircularPagination({ activePage, totalPages, onNext, onPrev, onSetPage }) {
    const [pageGroup, setPageGroup] = useState(0);
    const pagesPerGroup = 2;

    const getItemProps = (index) => ({
        variant: activePage === index ? "filled" : "text",
        color: "gray",
        onClick: () => onSetPage(index),
        className: "rounded-full ",
    });

    const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .slice(pageGroup * pagesPerGroup, (pageGroup + 1) * pagesPerGroup);

    const handleNextGroup = () => {
        if ((pageGroup + 1) * pagesPerGroup < totalPages) {
            setPageGroup(pageGroup + 1);
        }
    };

    const handlePrevGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
        }
    };

    return (
        <div className="flex items-center gap-4 mt-4">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => {
                    onPrev();
                    if (activePage === visiblePages[0] && pageGroup > 0) {
                        handlePrevGroup();
                    }
                }}
                disabled={activePage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-2 w-2 md:h-4 md:w-4" /> Anterior
            </Button>
            <div className="flex items-center gap-2">
                {visiblePages.map((page) => (
                    <IconButton key={page} {...getItemProps(page)}>
                        {page}
                    </IconButton>
                ))}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => {
                    onNext();
                    if (activePage === visiblePages[visiblePages.length - 1] && (pageGroup + 1) * pagesPerGroup < totalPages) {
                        handleNextGroup();
                    }
                }}
                disabled={activePage === totalPages}
            >
                Siguiente
                <ArrowRightIcon strokeWidth={2} className="h-2 w-2 md:h-4 md:w-4" />
            </Button>
        </div>
    );
}
