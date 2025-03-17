import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import RecordsSkeleton from "./RecordsSkeleton";

const RecordsLayout = () => {
  return (
    <Suspense fallback={<RecordsSkeleton />}>
      <div className="h-full w-full bg-background">
        <Outlet />
      </div>
    </Suspense>
  );
};

export default RecordsLayout;
