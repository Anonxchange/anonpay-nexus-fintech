
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { KycStatus, EmailStatus } from "../../types/auth";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Check, 
  X, 
  Search, 
  Upload, 
  AlertCircle,
  Users,
  CreditCard,
  Activity,
  Wallet,
  Clock,
  UserCheck,
  FileText,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the User type based on what's used in the component
interface User {
  id: string;
  email: string;
  role: string;
  emailStatus: EmailStatus;
  kycStatus: KycStatus;
  walletBalance: number;
  name: string;
  registrationDate?: Date;
}

interface AdminPanelProps {
  currentAdmin: any;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "pending",
    walletBalance: 25000,
    name: "John Doe",
    registrationDate: new Date("2023-03-15")
  },
  {
    id: "2",
    email: "admin@example.com",
    role: "admin",
    emailStatus: "verified",
    kycStatus: "approved",
    walletBalance: 50000,
    name: "Admin User",
    registrationDate: new Date("2023-01-10")
  },
  {
    id: "3",
    email: "new@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "not_submitted",
    walletBalance: 0,
    name: "New User",
    registrationDate: new Date("2023-05-20")
  },
  {
    id: "4",
    email: "rejected@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "rejected",
    walletBalance: 5000,
    name: "Rejected User",
    registrationDate: new Date("2023-04-05")
  },
  {
    id: "5",
    email: "sarah@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "approved",
    walletBalance: 12500,
    name: "Sarah Johnson",
    registrationDate: new Date("2023-06-12")
  },
  {
    id: "6",
    email: "michael@example.com",
    role: "user",
    emailStatus: "unverified",
    kycStatus: "not_submitted",
    walletBalance: 0,
    name: "Michael Wilson",
    registrationDate: new Date("2023-07-18")
  },
  {
    id: "7",
    email: "emily@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "pending",
    walletBalance: 8000,
    name: "Emily Brown",
    registrationDate: new Date("2023-08-22")
  }
];

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: string;
  amount: number;
  status: "pending" | "completed" | "rejected";
  createdAt: Date;
  reference?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "t1",
    userId: "1",
    userName: "John Doe",
    type: "Wallet Funding",
    amount: 10000,
    status: "completed",
    createdAt: new Date("2023-05-01"),
    reference: "REF123456"
  },
  {
    id: "t2",
    userId: "1",
    userName: "John Doe",
    type: "Crypto Buy",
    amount: 5000,
    status: "pending",
    createdAt: new Date("2023-05-02"),
    reference: "REF123457"
  },
  {
    id: "t3",
    userId: "3",
    userName: "New User",
    type: "Gift Card Sell",
    amount: 7500,
    status: "pending",
    createdAt: new Date("2023-05-03"),
    reference: "REF123458"
  },
  {
    id: "t4",
    userId: "4",
    userName: "Rejected User",
    type: "Airtime",
    amount: 1000,
    status: "completed",
    createdAt: new Date("2023-05-04"),
    reference: "REF123459"
  },
  {
    id: "t5",
    userId: "5",
    userName: "Sarah Johnson",
    type: "Wallet Funding",
    amount: 15000,
    status: "completed",
    createdAt: new Date("2023-06-15"),
    reference: "REF123460"
  },
  {
    id: "t6",
    userId: "5",
    userName: "Sarah Johnson",
    type: "Crypto Sell",
    amount: 3500,
    status: "completed",
    createdAt: new Date("2023-07-01"),
    reference: "REF123461"
  },
  {
    id: "t7",
    userId: "7",
    userName: "Emily Brown",
    type: "Gift Card Buy",
    amount: 2000,
    status: "rejected",
    createdAt: new Date("2023-08-25"),
    reference: "REF123462"
  },
  {
    id: "t8",
    userId: "1",
    userName: "John Doe",
    type: "Data Bundle",
    amount: 3000,
    status: "completed",
    createdAt: new Date("2023-09-05"),
    reference: "REF123463"
  }
];

interface Rate {
  id: string;
  name: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: Date;
  category: "crypto" | "giftcard";
}

const mockRates: Rate[] = [
  {
    id: "r1",
    name: "Bitcoin (BTC)",
    buyRate: 1560,
    sellRate: 1500,
    lastUpdated: new Date("2023-05-01"),
    category: "crypto"
  },
  {
    id: "r2",
    name: "Tether (USDT)",
    buyRate: 1560,
    sellRate: 1500,
    lastUpdated: new Date("2023-05-01"),
    category: "crypto"
  },
  {
    id: "r3",
    name: "Amazon Gift Card",
    buyRate: 1050,
    sellRate: 800,
    lastUpdated: new Date("2023-05-01"),
    category: "giftcard"
  },
  {
    id: "r4",
    name: "iTunes Gift Card",
    buyRate: 1020,
    sellRate: 780,
    lastUpdated: new Date("2023-05-01"),
    category: "giftcard"
  },
  {
    id: "r5",
    name: "Google Play Gift Card",
    buyRate: 980,
    sellRate: 750,
    lastUpdated: new Date("2023-05-01"),
    category: "giftcard"
  },
  {
    id: "r6",
    name: "Steam Gift Card",
    buyRate: 900,
    sellRate: 700,
    lastUpdated: new Date("2023-05-01"),
    category: "giftcard"
  },
  {
    id: "r7",
    name: "Ethereum (ETH)",
    buyRate: 1500,
    sellRate: 1450,
    lastUpdated: new Date("2023-05-01"),
    category: "crypto"
  },
  {
    id: "r8",
    name: "Binance Coin (BNB)",
    buyRate: 1450,
    sellRate: 1400,
    lastUpdated: new Date("2023-05-01"),
    category: "crypto"
  }
];

const AdminPanel: React.FC<AdminPanelProps> = ({ currentAdmin }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [rates, setRates] = useState<Rate[]>(mockRates);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [updatedRate, setUpdatedRate] = useState<{ buyRate: string; sellRate: string }>({ buyRate: "", sellRate: "" });
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);

  // Filters for transactions
  const [transactionFilters, setTransactionFilters] = useState({
    userId: "",
    type: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: ""
  });
  
  // Stats calculation
  const totalUsers = users.length;
  const pendingKYCs = users.filter(user => user.kycStatus === "pending").length;
  const totalWalletBalance = users.reduce((acc, user) => acc + user.walletBalance, 0);
  const todayTransactions = transactions.filter(
    txn => txn.createdAt.toDateString() === new Date().toDateString()
  ).length;
  const weeklyTransactions = transactions.filter(
    txn => {
      const txnDate = new Date(txn.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return txnDate >= sevenDaysAgo;
    }
  ).length;
  
  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter transactions based on filters
  const filteredTransactions = transactions.filter(txn => {
    let matches = true;
    
    if (transactionFilters.userId && txn.userId !== transactionFilters.userId) {
      matches = false;
    }
    
    if (transactionFilters.type && txn.type !== transactionFilters.type) {
      matches = false;
    }
    
    if (transactionFilters.status && txn.status !== transactionFilters.status) {
      matches = false;
    }
    
    if (transactionFilters.startDate && txn.createdAt < transactionFilters.startDate) {
      matches = false;
    }
    
    if (transactionFilters.endDate) {
      const endDate = new Date(transactionFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (txn.createdAt > endDate) {
        matches = false;
      }
    }
    
    return matches;
  });
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle KYC approval/rejection
  const handleKycUpdate = (userId: string, status: KycStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, kycStatus: status } : user
      )
    );
    
    toast({
      title: `KYC ${status === "approved" ? "Approved" : "Rejected"}`,
      description: `The KYC for user has been ${status === "approved" ? "approved" : "rejected"}.`,
    });
    
    // Close the dialog
    setSelectedUser(null);
  };
  
  // Handle wallet funding
  const handleWalletFund = (userId: string, amount: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, walletBalance: user.walletBalance + amount }
          : user
      )
    );
    
    setTransactions(prev => [
      {
        id: `t${Date.now()}`,
        userId: userId,
        userName: users.find(u => u.id === userId)?.name || "Unknown",
        type: "Wallet Funding (Admin)",
        amount: amount,
        status: "completed",
        createdAt: new Date(),
        reference: `REF${Date.now().toString().substring(7)}`
      },
      ...prev,
    ]);
    
    toast({
      title: "Wallet Funded",
      description: `${formatCurrency(amount)} has been added to the user's wallet.`,
    });
  };
  
  // Handle transaction approval/rejection
  const handleTransactionUpdate = (txId: string, status: "completed" | "rejected") => {
    setTransactions(prevTxns =>
      prevTxns.map(txn =>
        txn.id === txId ? { ...txn, status } : txn
      )
    );
    
    toast({
      title: `Transaction ${status === "completed" ? "Approved" : "Rejected"}`,
      description: `The transaction has been ${status === "completed" ? "approved" : "rejected"}.`,
    });
    
    // Close the dialog
    setSelectedTransaction(null);
  };
  
  // Handle rate update
  const handleRateUpdate = (rateId: string) => {
    if (!selectedRate) return;
    
    const buyRate = parseFloat(updatedRate.buyRate);
    const sellRate = parseFloat(updatedRate.sellRate);
    
    if (isNaN(buyRate) || isNaN(sellRate)) {
      toast({
        variant: "destructive",
        title: "Invalid rates",
        description: "Please enter valid numbers for both rates.",
      });
      return;
    }
    
    setRates(prevRates =>
      prevRates.map(rate =>
        rate.id === rateId
          ? {
              ...rate,
              buyRate: buyRate,
              sellRate: sellRate,
              lastUpdated: new Date(),
            }
          : rate
      )
    );
    
    toast({
      title: "Rate Updated",
      description: `The rate for ${selectedRate.name} has been updated.`,
    });
    
    setSelectedRate(null);
  };

  // Get unique transaction types for filter
  const transactionTypes = [...new Set(transactions.map(t => t.type))];
  
  // Reset transaction filters
  const resetTransactionFilters = () => {
    setTransactionFilters({
      userId: "",
      type: "",
      startDate: null,
      endDate: null,
      status: ""
    });
  };
  
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="rates">Rates</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      {/* Dashboard Tab */}
      <TabsContent value="dashboard" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{totalUsers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending KYCs</p>
                <h3 className="text-2xl font-bold mt-1">{pendingKYCs}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <UserCheck className="w-6 h-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Wallet Balance</p>
                <h3 className="text-xl font-bold mt-1">{formatCurrency(totalWalletBalance)}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{todayTransactions}</h3>
                <p className="text-xs text-gray-500 mt-1">{weeklyTransactions} this week</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest 5 transactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.userName}</TableCell>
                      <TableCell>{txn.type}</TableCell>
                      <TableCell>{formatCurrency(txn.amount)}</TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={txn.status as any} 
                          type="kyc"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => navigate("/admin?tab=transactions")}>
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Verifications</CardTitle>
              <CardDescription>Users awaiting KYC approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(user => user.kycStatus === "pending")
                    .slice(0, 5)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.registrationDate ? formatDate(user.registrationDate) : "N/A"}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {users.filter(user => user.kycStatus === "pending").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No pending KYC verifications
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => navigate("/admin?tab=users")}>
                  View All Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>User Management</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              Manage users, approve KYC, and handle wallet operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.kycStatus} />
                    </TableCell>
                    <TableCell>{formatCurrency(user.walletBalance)}</TableCell>
                    <TableCell>{user.registrationDate ? formatDate(user.registrationDate) : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Name</p>
                                    <p className="text-sm">{selectedUser.name || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">KYC Status</p>
                                    <StatusBadge status={selectedUser.kycStatus} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Email Status</p>
                                    <StatusBadge status={selectedUser.emailStatus} type="email" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Role</p>
                                    <p className="text-sm capitalize">{selectedUser.role}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Wallet Balance</p>
                                    <p className="text-sm">{formatCurrency(selectedUser.walletBalance)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Registration Date</p>
                                    <p className="text-sm">
                                      {selectedUser.registrationDate ? formatDate(selectedUser.registrationDate) : "N/A"}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* KYC Actions */}
                                {selectedUser.kycStatus === "pending" && (
                                  <div className="border rounded-md p-4 bg-amber-50">
                                    <h3 className="font-medium mb-2">KYC Verification Pending</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                      Review the user's submitted documents and approve or reject their KYC.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        className="bg-white border-green-500 text-green-600 hover:bg-green-50"
                                        onClick={() => handleKycUpdate(selectedUser.id, "approved")}
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="outline"
                                        className="bg-white border-red-500 text-red-600 hover:bg-red-50"
                                        onClick={() => handleKycUpdate(selectedUser.id, "rejected")}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Fund Wallet */}
                                <div className="border rounded-md p-4">
                                  <h3 className="font-medium mb-2">Fund User Wallet</h3>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Amount"
                                      value={fundAmount}
                                      onChange={(e) => setFundAmount(e.target.value)}
                                    />
                                    <Button
                                      onClick={() => {
                                        if (!fundAmount) return;
                                        handleWalletFund(selectedUser.id, parseFloat(fundAmount));
                                        setFundAmount("");
                                      }}
                                      disabled={!fundAmount || isNaN(parseFloat(fundAmount))}
                                    >
                                      Fund
                                    </Button>
                                  </div>
                                </div>

                                {/* Transaction History */}
                                <div className="border rounded-md p-4">
                                  <h3 className="font-medium mb-2">Transaction History</h3>
                                  <div className="max-h-60 overflow-y-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Type</TableHead>
                                          <TableHead>Amount</TableHead>
                                          <TableHead>Date</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {transactions
                                          .filter(txn => txn.userId === selectedUser.id)
                                          .slice(0, 5)
                                          .map((txn) => (
                                            <TableRow key={txn.id}>
                                              <TableCell>{txn.type}</TableCell>
                                              <TableCell>{formatCurrency(txn.amount)}</TableCell>
                                              <TableCell>{formatDate(txn.createdAt)}</TableCell>
                                            </TableRow>
                                          ))}
                                        {transactions.filter(txn => txn.userId === selectedUser.id).length === 0 && (
                                          <TableRow>
                                            <TableCell colSpan={3} className="text-center py-2">
                                              No transactions
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Transactions Tab */}
      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Transaction Management</CardTitle>
            <CardDescription>
              Review and manage all transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-3">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="user-filter" className="mb-1 block">User</Label>
                  <Select
                    value={transactionFilters.userId}
                    onValueChange={(value) => setTransactionFilters({...transactionFilters, userId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Users</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type-filter" className="mb-1 block">Transaction Type</Label>
                  <Select
                    value={transactionFilters.type}
                    onValueChange={(value) => setTransactionFilters({...transactionFilters, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {transactionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter" className="mb-1 block">Status</Label>
                  <Select
                    value={transactionFilters.status}
                    onValueChange={(value) => setTransactionFilters({...transactionFilters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Start Date</Label>
                  <DatePicker
                    date={transactionFilters.startDate}
                    setDate={(date) => setTransactionFilters({...transactionFilters, startDate: date})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-1 block">End Date</Label>
                  <DatePicker
                    date={transactionFilters.endDate}
                    setDate={(date) => setTransactionFilters({...transactionFilters, endDate: date})}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={resetTransactionFilters} className="mr-2">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.reference || "N/A"}</TableCell>
                    <TableCell>{txn.userName}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>{formatDate(txn.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={txn.status as any} 
                        type="kyc"
                      />
                    </TableCell>
                    <TableCell>
                      {txn.status === "pending" ? (
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedTransaction(txn)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Transaction</DialogTitle>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">Reference</p>
                                      <p className="text-sm">{selectedTransaction.reference || "N/A"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Transaction ID</p>
                                      <p className="text-sm">{selectedTransaction.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">User</p>
                                      <p className="text-sm">{selectedTransaction.userName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">User ID</p>
                                      <p className="text-sm">{selectedTransaction.userId}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Type</p>
                                      <p className="text-sm">{selectedTransaction.type}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Amount</p>
                                      <p className="text-sm">{formatCurrency(selectedTransaction.amount)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Date</p>
                                      <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Status</p>
                                      <div className="badge badge-pending">Pending</div>
                                    </div>
                                  </div>
                                  
                                  {/* Transaction Evidence (Mock) */}
                                  <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-2">Submitted Evidence</h3>
                                    <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center">
                                      <Upload className="w-6 h-6 text-gray-400" />
                                      <span className="ml-2 text-gray-500">View Screenshot</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between space-x-2">
                                    <Button 
                                      variant="outline" 
                                      className="bg-white border-green-500 text-green-600 hover:bg-green-50 w-full"
                                      onClick={() => handleTransactionUpdate(selectedTransaction.id, "completed")}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      className="bg-white border-red-500 text-red-600 hover:bg-red-50 w-full"
                                      onClick={() => handleTransactionUpdate(selectedTransaction.id, "rejected")}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedTransaction(txn)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Reference</p>
                                    <p className="text-sm">{selectedTransaction.reference || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Transaction ID</p>
                                    <p className="text-sm">{selectedTransaction.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">User</p>
                                    <p className="text-sm">{selectedTransaction.userName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">User ID</p>
                                    <p className="text-sm">{selectedTransaction.userId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Type</p>
                                    <p className="text-sm">{selectedTransaction.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Amount</p>
                                    <p className="text-sm">{formatCurrency(selectedTransaction.amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Date</p>
                                    <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <StatusBadge 
                                      status={selectedTransaction.status as any} 
                                      type="kyc"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No transactions found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Rates Tab */}
      <TabsContent value="rates" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Rate Management</CardTitle>
            <CardDescription>
              Update exchange rates for crypto and gift cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="crypto">
              <TabsList className="mb-4">
                <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                <TabsTrigger value="giftcard">Gift Cards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="crypto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Buy Rate (₦/$)</TableHead>
                      <TableHead>Sell Rate (₦/$)</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates
                      .filter(rate => rate.category === "crypto")
                      .map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>{rate.name}</TableCell>
                          <TableCell>₦{rate.buyRate.toLocaleString()}</TableCell>
                          <TableCell>₦{rate.sellRate.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(rate.lastUpdated)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRate(rate);
                                    setUpdatedRate({
                                      buyRate: rate.buyRate.toString(),
                                      sellRate: rate.sellRate.toString()
                                    });
                                  }}
                                >
                                  Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Update Rate</DialogTitle>
                                  <DialogDescription>
                                    Change the buy and sell rates for {selectedRate?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRate && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="buy-rate">Buy Rate (₦/$)</Label>
                                      <Input
                                        id="buy-rate"
                                        value={updatedRate.buyRate}
                                        onChange={(e) => 
                                          setUpdatedRate({ ...updatedRate, buyRate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="sell-rate">Sell Rate (₦/$)</Label>
                                      <Input
                                        id="sell-rate"
                                        value={updatedRate.sellRate}
                                        onChange={(e) => 
                                          setUpdatedRate({ ...updatedRate, sellRate: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      if (selectedRate) {
                                        handleRateUpdate(selectedRate.id);
                                      }
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="giftcard">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gift Card</TableHead>
                      <TableHead>Buy Rate (₦/$)</TableHead>
                      <TableHead>Sell Rate (₦/$)</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates
                      .filter(rate => rate.category === "giftcard")
                      .map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>{rate.name}</TableCell>
                          <TableCell>₦{rate.buyRate.toLocaleString()}</TableCell>
                          <TableCell>₦{rate.sellRate.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(rate.lastUpdated)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRate(rate);
                                    setUpdatedRate({
                                      buyRate: rate.buyRate.toString(),
                                      sellRate: rate.sellRate.toString()
                                    });
                                  }}
                                >
                                  Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Update Rate</DialogTitle>
                                  <DialogDescription>
                                    Change the buy and sell rates for {selectedRate?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRate && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="buy-rate">Buy Rate (₦/$)</Label>
                                      <Input
                                        id="buy-rate"
                                        value={updatedRate.buyRate}
                                        onChange={(e) => 
                                          setUpdatedRate({ ...updatedRate, buyRate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="sell-rate">Sell Rate (₦/$)</Label>
                                      <Input
                                        id="sell-rate"
                                        value={updatedRate.sellRate}
                                        onChange={(e) => 
                                          setUpdatedRate({ ...updatedRate, sellRate: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      if (selectedRate) {
                                        handleRateUpdate(selectedRate.id);
                                      }
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Settings Tab */}
      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure global application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Email Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-from">From Email</Label>
                    <Input
                      id="email-from"
                      defaultValue="noreply@anonpay.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-name">From Name</Label>
                    <Input
                      id="email-name"
                      defaultValue="AnonPay Support"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">MailerSend API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    defaultValue="mlsn.3fcd283cc31dbf1e47145f710a4e3e97c7139c2bce80cf2b8f8ec6334e26c1a9"
                  />
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    For security reasons, API keys are masked in the interface.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">VTU API Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vtpass-email">VTPass Email</Label>
                  <Input
                    id="vtpass-email"
                    defaultValue="admin@anonpay.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vtpass-password">VTPass Password</Label>
                  <Input
                    id="vtpass-password"
                    type="password"
                    defaultValue="********"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vtpass-endpoint">API Endpoint</Label>
                  <Input
                    id="vtpass-endpoint"
                    defaultValue="https://vtpass.com/api/pay"
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Admin Account</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    defaultValue={ADMIN_EMAIL}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Change Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password-confirm">Confirm New Password</Label>
                  <Input
                    id="admin-password-confirm"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <Button className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanel;
