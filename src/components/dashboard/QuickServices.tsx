
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bitcoin, Gift, Phone, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const QuickServices: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Services</CardTitle>
        <CardDescription>Access our popular services</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Link to="/services/crypto">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Bitcoin className="h-6 w-6" />
            <span>Crypto</span>
          </Button>
        </Link>
        <Link to="/services/gift-cards">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Gift className="h-6 w-6" />
            <span>Gift Cards</span>
          </Button>
        </Link>
        <Link to="/services/vtu">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Phone className="h-6 w-6" />
            <span>VTU</span>
          </Button>
        </Link>
        <Link to="/services/rate-checker">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Search className="h-6 w-6" />
            <span>Rate Checker</span>
          </Button>
        </Link>
      </CardContent>
      <CardFooter>
        <Link to="/services" className="w-full">
          <Button variant="secondary" className="w-full">View All Services</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuickServices;
