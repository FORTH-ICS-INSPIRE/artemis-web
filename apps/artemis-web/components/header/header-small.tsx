import React, { useContext, useState } from 'react'
import { SidebarContext } from '../../context/sidebar-context'
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from '../../icons'
import { Avatar, Badge, Input, Dropdown, DropdownItem, WindmillContext } from '@windmill/react-ui'

function Header(props) {
  const { mode, toggleMode } = useContext(WindmillContext)
  const sidecontext: any = useContext(SidebarContext);
  const toggleSidebar: any = sidecontext.toggleSidebar;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _csrf: props._csrf }),
    });

    document.location.href = '/login';
  };
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className="z-40 my-2 py-4 bg-gray-100 shadow-bottom mx-4 rounded-2xl dark:bg-gray-600">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src="/aletter.png"
                alt=""
                aria-hidden="true"
              />
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
              className="z-40"
            >
              <DropdownItem tag="a" href="/password_change" className="dropdownItem">
                <OutlinePersonIcon className="w-4 h-4 mr-3 text-gray-700" aria-hidden="true" />
                <span className="text-gray-700">Password Change</span>
              </DropdownItem>
              <DropdownItem tag="a" href="/config_comparison" className="dropdownItem">
                <OutlineCogIcon className="w-4 h-4 mr-3 text-gray-700" aria-hidden="true" />
                <span className="text-gray-700">Config Comparison</span>
              </DropdownItem>
              <DropdownItem onClick={handleLogout} className="dropdownItem">
                <OutlineLogoutIcon className="w-4 h-4 mr-3 text-gray-700" aria-hidden="true" />
                <span className="text-gray-700">Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
