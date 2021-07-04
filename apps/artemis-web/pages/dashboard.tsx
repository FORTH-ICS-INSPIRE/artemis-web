import React, { useState } from "react";
export default function Dashboard() {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [profile, setProfile] = useState(false);
  return (
    <>
      <div className="absolute bg-gray-200 w-full h-full">
        {/* Page title ends */}
        <div className="container mx-auto px-6">
          {/* Remove class [ h-64 ] when adding a card block */}
          {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
          <div className="max-w-7xl px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="mt-2">
              <a className="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">Activity</a>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome back guest@guest.com, your last login was at (7/3/2021 6:36:16 PM). You are user.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
