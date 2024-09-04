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

interface DriverData {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  truckPlate: string;
  trailerPlate: string;
  phoneNumber: string;
  email: string;
  notes: string;
}

export default function NewDriverForm({
  isNewDriverOpen,
  setIsNewDriverOpen,
}: {
  isNewDriverOpen: boolean;
  setIsNewDriverOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [driverData, setDriverData] = useState<DriverData>({
    firstName: "",
    lastName: "",
    licenseNumber: "",
    truckPlate: "",
    trailerPlate: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setDriverData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Submitting driver:", driverData);
    setIsNewDriverOpen(false);
  };

  return (
    <Sheet open={isNewDriverOpen} onOpenChange={setIsNewDriverOpen}>
      <SheetTrigger asChild>
        <Button size={"xs"} variant={"minimal"}>
          New Driver
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-2">
          <SheetTitle>Add New Driver</SheetTitle>
          <SheetDescription>
            Enter the details for the new driver.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-3.5 pt-3.5">
          <div className="flex flex-col gap-4 p-1 space-y-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-500">
                First Name
              </Label>
              <Input
                id="firstName"
                value={driverData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-500">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={driverData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-gray-500">
                License Number
              </Label>
              <Input
                id="licenseNumber"
                value={driverData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Enter driver's license number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="truckPlate" className="text-gray-500">
                Truck Plate
              </Label>
              <Input
                id="truckPlate"
                value={driverData.truckPlate}
                onChange={handleInputChange}
                placeholder="Enter truck plate number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailerPlate" className="text-gray-500">
                Trailer Plate
              </Label>
              <Input
                id="trailerPlate"
                value={driverData.trailerPlate}
                onChange={handleInputChange}
                placeholder="Enter trailer plate number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-500">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={driverData.phoneNumber}
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
                value={driverData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-500">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={driverData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes about the driver"
              />
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-gray-950 hover:bg-gray-900 text-white hover:text-gray-50"
            variant={"outline"}
          >
            Add Driver
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
