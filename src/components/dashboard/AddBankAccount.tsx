
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddBankAccountProps {
  user: any;
}

const AddBankAccount: React.FC<AddBankAccountProps> = ({ user }) => {
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("savings");
  
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!bankName || !accountNumber || !accountName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would make an API call to save the bank account
    const newAccount = {
      id: Date.now().toString(),
      bankName,
      accountNumber,
      accountName,
      accountType,
      isPrimary: bankAccounts.length === 0,
    };
    
    setBankAccounts([...bankAccounts, newAccount]);
    
    toast({
      title: "Success",
      description: "Bank account added successfully!",
    });
    
    // Reset form
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setAccountType("savings");
    setIsAddingNew(false);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Bank Accounts</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Bank Accounts</CardTitle>
          <CardDescription>
            Add and manage your bank accounts for withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div 
                  key={account.id} 
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{account.bankName}</p>
                    <p className="text-sm text-gray-500">
                      {account.accountNumber} • {account.accountName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {account.accountType} {account.isPrimary && "• Primary"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!account.isPrimary && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const updated = bankAccounts.map(acc => ({
                            ...acc,
                            isPrimary: acc.id === account.id
                          }));
                          setBankAccounts(updated);
                          toast({
                            title: "Success",
                            description: "Primary account updated"
                          });
                        }}
                      >
                        Set as Primary
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        const filtered = bankAccounts.filter(acc => acc.id !== account.id);
                        // If we're removing the primary account, set the first remaining one as primary
                        if (account.isPrimary && filtered.length > 0) {
                          filtered[0].isPrimary = true;
                        }
                        setBankAccounts(filtered);
                        toast({
                          title: "Success",
                          description: "Bank account removed"
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-gray-500 mb-4">No bank accounts added yet</p>
              <Button onClick={() => setIsAddingNew(true)}>
                Add Your First Bank Account
              </Button>
            </div>
          )}
          
          {isAddingNew ? (
            <Card>
              <CardHeader>
                <CardTitle>Add New Bank Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBankAccount} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)} 
                      placeholder="Enter bank name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      value={accountNumber} 
                      onChange={(e) => setAccountNumber(e.target.value)} 
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input 
                      id="accountName" 
                      value={accountName} 
                      onChange={(e) => setAccountName(e.target.value)} 
                      placeholder="Enter account name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="domiciliary">Domiciliary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Bank Account</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            bankAccounts.length > 0 && (
              <Button onClick={() => setIsAddingNew(true)}>
                Add Another Bank Account
              </Button>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBankAccount;
