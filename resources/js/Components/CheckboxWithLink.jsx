import { Checkbox, Typography } from "@material-tailwind/react";

export function CheckboxWithLink() {
    return (
        <Checkbox
            label={
                <Typography color="blue-gray" className="flex font-medium text-xs">
                    Declaro que cuento con la autorización del titular que será consultado, de acuerdo con los siguientes términos.
                </Typography>
            }
        />
    );
}
