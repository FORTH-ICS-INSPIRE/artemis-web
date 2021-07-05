import React from 'react'
import { useContext } from 'react'

import { Transition, Backdrop } from '@windmill/react-ui';


function Sidebar() {
  return (
    <>
      <aside className="z-30 flex-shrink-0 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 lg:block">
        {/* <SidebarContent /> */}
      </aside>

      <Transition show={false}>
        <>
          <Transition
            enter="transition ease-in-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Backdrop />
          </Transition>

          <Transition
            enter="transition ease-in-out duration-150"
            enterFrom="opacity-0 transform -translate-x-20"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 transform -translate-x-20"
          >
            <aside className="fixed inset-y-0 z-50 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 lg:hidden">
              <SidebarContent />
            </aside>
          </Transition>
        </>
      </Transition>
    </>
  )
}

export default Sidebar
