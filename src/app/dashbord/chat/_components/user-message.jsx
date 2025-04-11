import React from "react";

export default function UserMessageCard({ message }) {
  return (
    <div className="w-fit rounded-lg p-2 bg-primary text-white flex flex-col">
      <div className="text-sm">{message}</div>
      <div className="text-xs text-gray-200 mt-2">
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}
