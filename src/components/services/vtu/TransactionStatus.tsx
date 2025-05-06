
import React from "react";
import { Loader2, Check, AlertCircle, HelpCircle } from "lucide-react";

interface TransactionStatusProps {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, message }) => {
  if (status === "idle") return null;
  
  return (
    <div 
      className={`p-4 rounded-md mb-4 flex items-center ${
        status === "loading" ? "bg-blue-50 text-blue-700 border border-blue-200" :
        status === "success" ? "bg-green-50 text-green-700 border border-green-200" :
        "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      <div className="mr-3">
        {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
        {status === "success" && <Check className="h-5 w-5" />}
        {status === "error" && <AlertCircle className="h-5 w-5" />}
      </div>
      <div>
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  );
};

export default TransactionStatus;
