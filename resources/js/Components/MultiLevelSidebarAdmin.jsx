import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,

    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react'

export function MultiLevelSidebarAdmin() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <Card className=" w-full min-h-screen max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Gets Validator Admin
                </Typography>
            </div>
            <List>

                <ListItem>
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink href={route('dashboard.admin')} active={route().current('dashboard.admin')}>
                        Dashboard
                    </NavLink>

                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink href={route('indexUser.admin')} active={route().current('indexUser.admin')}>
                        Usuarios
                    </NavLink>

                </ListItem>
                <div className="mt-20">
                    <ListItem>
                        <ListItemPrefix>
                            <Cog6ToothIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <NavLink href={route('profile.editAdmin')} active={route().current('profile.editAdmin')}>
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
