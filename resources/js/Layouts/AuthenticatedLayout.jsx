import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { MultiLevelSidebar } from '@/Components/MultiLevelSidebar';
import 'boxicons'

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);


    return (
        <div className="min-h-screen bg-gray-100">
            <nav className=" border-b bg-[#C39BD3] border-gray-100">
                <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        <div className="shrink-0 gap-x-10 flex items-center">

                            <Link href="/">
                                <img src="/img/r-Gets.png" className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                            <div className='flex gap-x-2 justify-center items-center'>
                                {!showSidebar && (
                                    <h5 className='block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900'>Gets Validator</h5>
                                )}
                                <button
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <box-icon name='menu'></box-icon>
                                </button>
                            </div>
                            {user.roles.includes("admin") && (
                                <Link href={route('indexUser.admin')} className='bg-[#9c3fc0] p-2 rounded-lg text-sm' >Administrativo</Link>

                            )}
                        </div>



                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')}>
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>


            <main className="flex flex-grow">
                {showSidebar && (
                    <div className="">
                        <MultiLevelSidebar />
                    </div>

                )}
                <div className="flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}
