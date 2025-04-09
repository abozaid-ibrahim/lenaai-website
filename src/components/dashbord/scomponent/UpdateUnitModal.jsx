"use client";
import React from "react";
import UpdateUnitForm from "./UpdateUnitForm";

const UpdateUnitModal = ({ isOpen, onClose, unit, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Full-width scrollable modal */}
      <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
        <div className="relative w-full h-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Update Unit</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 text-xl"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            <UpdateUnitForm
              unit={unit}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUnitModal;
