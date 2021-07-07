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

    const routes = [
        {
            path: '/dashboard', // the url
            icon: 'HomeIcon', // the component being exported from icons/index.js
            name: 'Dashboard', // name that appear in Sidebar
        },
        {
            path: '/bgpupdates',
            icon: 'FormsIcon',
            name: 'BGP Updates',
        },
        {
            path: '/app/cards',
            icon: 'CardsIcon',
            name: 'Cards',
        },
        {
            path: '/app/charts',
            icon: 'ChartsIcon',
            name: 'Charts',
        },
        {
            path: '/app/buttons',
            icon: 'ButtonsIcon',
            name: 'Buttons',
        },
        {
            path: '/app/modals',
            icon: 'ModalsIcon',
            name: 'Modals',
        },
        {
            path: '/app/tables',
            icon: 'TablesIcon',
            name: 'Tables',
        },
        {
            icon: 'PagesIcon',
            name: 'Pages',
            routes: [
                // submenu
                {
                    path: '/login',
                    name: 'Login',
                },
                {
                    path: '/create-account',
                    name: 'Create account',
                },
                {
                    path: '/forgot-password',
                    name: 'Forgot password',
                },
                {
                    path: '/app/404',
                    name: '404',
                },
                {
                    path: '/app/blank',
                    name: 'Blank',
                },
            ],
        },
    ]

    return (
        <div className="py-4 text-gray-500 dark:text-gray-400">
            <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
                <img className="w-32 ml-6" src="../artemis-logo.png"></img>
            </a>
            <ul className="mt-6">
                {routes.map((route) =>
                    route.routes ? (
                        <SidebarSubmenu route={route} key={route.name} />
                    ) : (
                        <li className="relative px-6 py-3" key={route.name}>
                            <a
                                href={route.path}>
                                <span
                                    className={(path.includes(route.path) ? "bg-logo-crimson " : "") + "absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg"}
                                    aria-hidden="true"
                                ></span>
                                <Icon className={"w-5 h-5 inline " + (path.includes(route.path) ? "font-bold" : "")} aria-hidden="true" icon={route.icon} />
                                <span className={"ml-4 text-sm " + (path.includes(route.path) ? "font-bold" : "")}>{route.name}</span>
                            </a>
                        </li>
                    )
                )
                }
            </ul >
        </div >
    )
}

export default SidebarContent
