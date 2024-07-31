import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import 'boxicons'
import { MultiLevelSidebarAdmin } from '@/Components/MultiLevelSidebarAdmin';

export default function AuthenticatedLayoutAdmin({ user, header, children }) {
    const [showSidebar, setShowSidebar] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
            if (window.innerWidth >= 640) {
                setShowSidebar(true);
            } else {
                setShowSidebar(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className="min-h-screen bg-gray-100">
            <nav className=" border-b bg-[#C39BD3] border-gray-100">
                <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 gap-x-10 flex items-center">

                                <Link href="/">
                                    <img src="/img/r-Gets.png" className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>

                                <div className='flex gap-x-2 justify-center items-center'>
                                    <button
                                        onClick={() => setShowSidebar(!showSidebar)}
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                    >
                                        <box-icon name='menu'></box-icon>
                                    </button>
                                    {!showSidebar && (
                                        <h5 className='hidden  md:block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900'>Gets Validator Admin</h5>
                                    )}

                                </div>
                                {user.roles.includes("admin") && (
                                    <Link href={route('dashboard')} className='bg-[#9c3fc0] hover:bg-[#aa4fce] p-2 rounded-lg w-10 h-9 flex justify-center items-center' ><img className='' src="/img/icon-user-2.svg" alt="" /></Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </nav>


            <main className="flex overflow-x-auto">
                {showSidebar && (
                    <div className="mr-4 md:m-0 ">
                        <MultiLevelSidebarAdmin screenSize={screenSize} />
                    </div>
                )}
                <div className="flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}
