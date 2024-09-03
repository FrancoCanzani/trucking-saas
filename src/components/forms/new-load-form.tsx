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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { MapIcon, UploadIcon } from "lucide-react";

interface Location {
  type: "pickup" | "dropoff";
  address: string;
}

export default function NewLoadForm({
  isNewLoadOpen,
  setIsNewLoadOpen,
}: {
  isNewLoadOpen: boolean;
  setIsNewLoadOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [locations, setLocations] = useState<Location[]>([
    { type: "pickup", address: "" },
    { type: "dropoff", address: "" },
  ]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [rateConfirmation, setRateConfirmation] = useState<File | null>(null);

  const addLocation = (type: "pickup" | "dropoff") => {
    setLocations([...locations, { type, address: "" }]);
  };

  const removeLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const updateLocation = (index: number, address: string) => {
    const newLocations = [...locations];
    newLocations[index].address = address;
    setLocations(newLocations);
  };

  const handleRateConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setRateConfirmation(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Submitting load:", {
      locations,
      selectedDriver,
      rateConfirmation,
    });
    setIsNewLoadOpen(false);
  };

  return (
    <Sheet open={isNewLoadOpen} onOpenChange={setIsNewLoadOpen}>
      <SheetTrigger asChild>
        <Button>New Load</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Load</SheetTitle>
          <SheetDescription>
            Enter the details for the new load.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-3.5">
          <div className="flex flex-col gap-4 p-2">
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 justify-center"
              >
                <div className="flex-grow">
                  <Label
                    htmlFor={`location-${index}`}
                    className="text-sm font-medium text-gray-500"
                  >
                    {location.type === "pickup" ? "Pickup" : "Dropoff"}
                  </Label>
                  <div className="flex items-center mt-2 gap-x-2">
                    <MapIcon className="h-5 w-5 text-gray-400" />
                    <Input
                      id={`location-${index}`}
                      value={location.address}
                      onChange={(e) => updateLocation(index, e.target.value)}
                      className="flex-grow"
                      placeholder="Enter address"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeLocation(index)}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <Button onClick={() => addLocation("pickup")} variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Pickup
              </Button>
              <Button onClick={() => addLocation("dropoff")} variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Dropoff
              </Button>
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <Label htmlFor="driver" className="text-gray-500 text-start">
                Driver
              </Label>
              <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver1">Driver 1</SelectItem>
                  <SelectItem value="driver2">Driver 2</SelectItem>
                  {/* TODO: Fetch and populate actual drivers */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <Label
                htmlFor="instructions"
                className="text-gray-500 text-start"
              >
                Instructions
              </Label>
              <Textarea id="instructions" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <Label htmlFor="price" className="text-gray-500 text-start">
                Price
              </Label>
              <Input id="price" type="number" placeholder="Enter price" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <Label
                htmlFor="rate-confirmation"
                className="text-gray-500 text-start"
              >
                Rate Confirmation
              </Label>
              <div className="flex items-center gap-x-2">
                <Input
                  id="rate-confirmation"
                  type="file"
                  onChange={handleRateConfirmationChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("rate-confirmation")?.click()
                  }
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                {rateConfirmation && (
                  <span className="text-sm text-gray-500">
                    {rateConfirmation.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button onClick={handleSubmit} className="w-full">
            Add Load
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
