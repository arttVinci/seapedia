import React from "react";
import { StatusHistory } from "../../@types/models/order.types";

interface OrderTimelineProps {
  histories: StatusHistory[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ histories }) => {
  // Sort histories from newest to oldest
  const sortedHistories = [...histories].sort((a, b) => b.created_at - a.created_at);

  if (sortedHistories.length === 0) {
    return <div className="text-gray-500 text-sm">Belum ada riwayat status.</div>;
  }

  return (
    <div className="space-y-4 relative border-l border-gray-200 ml-3">
      {sortedHistories.map((history, idx) => {
        // The newest item (index 0) gets a solid blue dot, others get a gray/faded dot
        const isNewest = idx === 0;
        const dotColor = isNewest ? "bg-blue-500" : "bg-gray-300";
        
        return (
          <div key={history.id} className="mb-4 ml-6 relative">
            <div className={`absolute w-3 h-3 ${dotColor} rounded-full -left-[29px] top-1.5 border border-white`}></div>
            <p className={`font-semibold ${isNewest ? 'text-black' : 'text-gray-600'}`}>
              {history.status}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(history.created_at * 1000).toLocaleString("id-ID")}
            </p>
            {history.note && (
              <p className={`text-sm mt-1 ${isNewest ? 'text-gray-700' : 'text-gray-500'}`}>
                {history.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
