import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
// import SidebarSubmenu from './SidebarSubmenu'
import { Button } from '@windmill/react-ui'
import SidebarSubmenu from './SidebarSubmenu'
import { useState } from 'react'
import { useEffect } from 'react'

function Icon({ icon, ...props }) {
    const Icon = Icons[icon]
    return <Icon {...props} />
}

function SidebarContent() {
    const [path, setPath] = useState('');
    useEffect(() => {
        if (typeof window !== "undefined")
            setPath(window.location.pathname);
    }, []);

    return (
        <div className="bg-gray-100 ml-4 h-full rounded-2xl dark:bg-gray-600">
            <div className="flex items-center justify-center pt-6">
                <img className="w-32" src="../artemis-logo.png"></img>
            </div>
            <nav className="mt-6">
                <div>
                    <a className="w-full font-thin uppercase text-blue-500 flex items-center p-4 mb-2 mt-8  transition-colors duration-200 justify-start bg-gradient-to-r from-white to-blue-100 border-r-4 border-blue-500 dark:from-gray-700 dark:to-gray-800 border-r-4 border-blue-500" href="/dashboard">
                        <span className="text-left">
                            <svg width={20} height={20} fill="currentColor" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z">
                                </path>
                            </svg>
                        </span>
                        <span className="mx-4 text-sm font-normal">
                            Dashboard
                        </span>
                    </a>
                    <a className="w-full font-thin uppercase text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-blue-500" href="/bgpupdates">
                        <span className="text-left">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </span>
                        <span className="mx-4 text-sm font-normal">
                            BGP Updates
                        </span>
                    </a>
                    <a className="w-full font-thin uppercase text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-blue-500" href="/hijacks">
                        <span className="text-left">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </span>
                        <span className="mx-4 text-sm font-normal">
                            HIJACKS
                        </span>
                    </a>
                </div>
            </nav>
        </div>

    )
}

export default SidebarContent
