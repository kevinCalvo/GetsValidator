import React, { useState } from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';

export function MultiLevelSidebar({ screenSize }) {
    const [open, setOpen] = useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <Card className={`w-full min-h-screen ${screenSize < 640 ? "max-w-full" : "max-w-[20rem]"} p-4 shadow-xl shadow-blue-gray-900/5`}>
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Gets Validator
                </Typography>
            </div>
            <List>
                <Accordion
                    open={open === 0}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <PresentationChartBarIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Consultas
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Consultas por documento
                                </NavLink>
                            </ListItem>
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                <NavLink href={route('scanner.index')} active={route().current('scanner.index')}>
                                    Codigo de barras
                                </NavLink>
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>
                <ListItem>
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink href={route('consult.index')} active={route().current('consult.index')}>
                        Historial de consultas
                    </NavLink>
                </ListItem>
                <div className="mt-20">
                    <ListItem>
                        <ListItemPrefix>
                            <Cog6ToothIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <NavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                            Perfil
                        </NavLink>
                    </ListItem>
                    <ListItem>
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <NavLink as="button" method="post" href={route('logout')}>
                            Cerrar sesion
                        </NavLink>
                    </ListItem>
                </div>
            </List>
        </Card>
    );
}
