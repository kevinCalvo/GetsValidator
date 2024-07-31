import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CircularPagination({ activePage, totalPages, onNext, onPrev, onSetPage }) {
    const getItemProps = (index) => ({
        variant: activePage === index ? "filled" : "text",
        color: "gray",
        onClick: () => onSetPage(index),
        className: "rounded-full",
    });

    return (
        <div className="flex items-center gap-4 mt-4">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={onPrev}
                disabled={activePage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Anterior
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <IconButton key={index} {...getItemProps(index + 1)}>
                        {index + 1}
                    </IconButton>
                ))}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={onNext}
                disabled={activePage === totalPages}
            >
                Siguiente
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}
