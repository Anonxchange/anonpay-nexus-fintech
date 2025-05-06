
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewToggleProps } from "./types";

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  setActiveView,
  pendingCount,
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Button 
        variant={activeView === "cards" ? "default" : "outline"} 
        onClick={() => setActiveView("cards")}
      >
        Gift Cards
      </Button>
      <Button 
        variant={activeView === "submissions" ? "default" : "outline"} 
        onClick={() => setActiveView("submissions")}
      >
        Submissions
        {pendingCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {pendingCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default ViewToggle;
