// src/components/InstructionModal.js
import React from "react";

const InstructionModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      style={{ overflow: "hidden" }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative"
        style={{ maxWidth: "500px", width: "90%" }}
      >
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <p className="mb-4">
          Welcome to the Canvas Board application. Here you can:
          <ul className="list-disc list-inside">
            <li>Drag and drop the Images onto the canvas.</li>
            <li>
              Click the image to Scale, Translate, or Rotate the images as
              needed.
            </li>
            <li>Right-click the image to draw or share.</li>
            <li>Visit /display to see the realtime sharing</li>
          </ul>
        </p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
        >
          ✖️ Close
        </button>
      </div>
    </div>
  );
};

export default InstructionModal;
