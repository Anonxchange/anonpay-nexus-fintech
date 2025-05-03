import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "../../contexts/AuthContext";

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
    name: "John Doe"
  },
  {
    id: "2",
    email: "admin@example.com",
    role: "admin",
    emailStatus: "verified",
    kycStatus: "approved",
    walletBalance: 50000,
    name: "Admin User"
  },
  {
    id: "3",
    email: "new@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "not_submitted",
    walletBalance: 0,
    name: "New User"
  },
  {
    id: "4",
    email: "rejected@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "rejected",
    walletBalance: 5000,
    name: "Rejected User"
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
  },
  {
    id: "t2",
    userId: "1",
    userName: "John Doe",
    type: "Crypto Buy",
    amount: 5000,
    status: "pending",
    createdAt: new Date("2023-05-02"),
  },
  {
    id: "t3",
    userId: "3",
    userName: "New User",
    type: "Gift Card Sell",
    amount: 7500,
    status: "pending",
    createdAt: new Date("2023-05-03"),
  },
  {
    id: "t4",
    userId: "4",
    userName: "Rejected User",
    type: "Airtime",
    amount: 1000,
    status: "completed",
    createdAt: new Date("2023-05-04"),
  },
];

interface Rate {
  id: string;
  name: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: Date;
}

const mockRates: Rate[] = [
  {
    id: "r1",
    name: "Bitcoin (BTC)",
    buyRate: 1560,
    sellRate: 1500,
    lastUpdated: new Date("2023-05-01"),
  },
  {
    id: "r2",
    name: "Tether (USDT)",
    buyRate: 1560,
    sellRate: 1500,
    lastUpdated: new Date("2023-05-01"),
  },
  {
    id: "r3",
    name: "Amazon Gift Card",
    buyRate: 1050,
    sellRate: 800,
    lastUpdated: new Date("2023-05-01"),
  },
  {
    id: "r4",
    name: "iTunes Gift Card",
    buyRate: 1020,
    sellRate: 780,
    lastUpdated: new Date("2023-05-01"),
  },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ currentAdmin }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [rates, setRates] = useState<Rate[]>(mockRates);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [updatedRate, setUpdatedRate] = useState<{ buyRate: string; sellRate: string }>({ buyRate: "", sellRate: "" });
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  
  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="rates">Rates</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
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
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
              Review and approve pending transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.userName}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>{formatDate(txn.createdAt)}</TableCell>
                    <TableCell>
                      <div className={`badge ${
                        txn.status === "completed"
                          ? "badge-approved"
                          : txn.status === "rejected"
                          ? "badge-rejected"
                          : "badge-pending"
                      }`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </div>
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
                                      <p className="text-sm font-medium">Transaction ID</p>
                                      <p className="text-sm">{selectedTransaction.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">User</p>
                                      <p className="text-sm">{selectedTransaction.userName}</p>
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
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
                {rates.map((rate) => (
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
