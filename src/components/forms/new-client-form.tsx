import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientData {
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  billingAddress: string;
  taxId: string;
  paymentTerms: string;
  notes: string;
}

export default function NewClientForm({
  isNewClientOpen,
  setIsNewClientOpen,
}: {
  isNewClientOpen: boolean;
  setIsNewClientOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [clientData, setClientData] = useState<ClientData>({
    companyName: "",
    contactFirstName: "",
    contactLastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    billingAddress: "",
    taxId: "",
    paymentTerms: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setClientData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Submitting client:", clientData);
    setIsNewClientOpen(false);
  };

  return (
    <Sheet open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
      <SheetTrigger asChild>
        <Button size={"xs"} variant={"minimal"}>
          New Client
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-2">
          <SheetTitle>Add New Client</SheetTitle>
          <SheetDescription>
            Enter the details for the new client.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-3.5">
          <div className="flex flex-col gap-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-500">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={clientData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactFirstName" className="text-gray-500">
                Contact First Name
              </Label>
              <Input
                id="contactFirstName"
                value={clientData.contactFirstName}
                onChange={handleInputChange}
                placeholder="Enter contact's first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactLastName" className="text-gray-500">
                Contact Last Name
              </Label>
              <Input
                id="contactLastName"
                value={clientData.contactLastName}
                onChange={handleInputChange}
                placeholder="Enter contact's last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-500">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={clientData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-500">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={clientData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-500">
                Address
              </Label>
              <Input
                id="address"
                value={clientData.address}
                onChange={handleInputChange}
                placeholder="Enter company address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress" className="text-gray-500">
                Billing Address
              </Label>
              <Input
                id="billingAddress"
                value={clientData.billingAddress}
                onChange={handleInputChange}
                placeholder="Enter billing address (if different)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId" className="text-gray-500">
                Tax ID / EIN
              </Label>
              <Input
                id="taxId"
                value={clientData.taxId}
                onChange={handleInputChange}
                placeholder="Enter Tax ID or EIN"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms" className="text-gray-500">
                Payment Terms
              </Label>
              <Input
                id="paymentTerms"
                value={clientData.paymentTerms}
                onChange={handleInputChange}
                placeholder="Enter payment terms (e.g., Net 30)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-500">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={clientData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes about the client"
              />
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button onClick={handleSubmit} className="w-full">
            Add Client
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
