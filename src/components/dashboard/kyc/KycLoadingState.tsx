
import React from "react";
import { Loader2 } from "lucide-react";

const KycLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default KycLoadingState;
