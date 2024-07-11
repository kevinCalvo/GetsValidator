import { Link } from '@inertiajs/react';

export default function NavLinkSide({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'text-[#fff] ' +
                (active
                    ? 'border-indigo-400 text-gray-950 focus:border-indigo-700 '
                    : 'border-transparent text-blue-500 hover:text-blue-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
