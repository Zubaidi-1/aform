import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className=" relative inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50"
      onClick={onClose} // Close the modal when clicking on the backdrop
    >
      <div
        className="bg-white p-6 rounded-lg w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicking inside the modal
      >
        <button
          className="absolute top-0 right-0 text-xl text-gray-600"
          onClick={onClose} // Close the modal when clicking the close button
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
