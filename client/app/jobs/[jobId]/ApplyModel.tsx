"use client";

import { useState } from "react";

export default function ApplyModal({ onClose, onSubmit, job, user }: any) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit(message);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Apply for {job.title}</h2>
        <p className="text-gray-600 mb-4">{job.company}</p>

        <div className="mt-2">
          <label className="text-sm font-semibold">Your Message</label>
          <textarea
            className="border p-2 w-full mt-2"
            rows={4}
            placeholder="Why should we hire you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
          onClick={handleSubmit}
        >
          Submit Application
        </button>

        <button
          className="w-full mt-2 bg-gray-300 text-black py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
