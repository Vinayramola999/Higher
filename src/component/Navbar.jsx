import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai'; // Importing logout icon from react-icons

const Navbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // Logic for logging out the user
    console.log("User logged out");
    setIsLogoutModalOpen(false); // Close modal after logout
  };

  // Function to handle clicks outside the modal
  const handleClickOutside = (event) => {
    const modal = document.getElementById('logout-modal');
    if (modal && !modal.contains(event.target)) {
      setIsLogoutModalOpen(false); // Close modal if clicking outside
    }
  };

  useEffect(() => {
    if (isLogoutModalOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLogoutModalOpen]);

  return (
    <nav className="bg-blue-600 rounded-lg m-4 p-4 flex justify-between items-center text-white sticky top-0 ">
      <div className="text-xl font-semibold">Asset Management</div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white text-black rounded-full py-1 pl-3 pr-2 text-sm sm:text-base">
          <span>Vinay Ramola</span>
          <img
            src="https://via.placeholder.com/40"
            alt="profile-pic"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            height="35"
            width="35"
          />
        </div>
        <button onClick={() => setIsLogoutModalOpen(true)} className="text-white">
          <AiOutlineLogout size={24} />
        </button>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
        >
          <div 
            id="logout-modal" 
            className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/3 p-6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
