
import React from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface TransactionStatusProps {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, message }) => {
  if (status === "idle") return null;
  
  return (
    <div 
      className={`p-4 rounded-md mb-4 ${
        status === "loading" ? "bg-blue-50 text-blue-700" :
        status === "success" ? "bg-green-50 text-green-700" :
        "bg-red-50 text-red-700"
      }`}
    >
      <div className="flex items-center">
        {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {status === "success" && <Check className="mr-2 h-4 w-4" />}
        {status === "error" && <AlertCircle className="mr-2 h-4 w-4" />}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default TransactionStatus;
