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

interface LoadDetails {
  weight: string;
  temperature: string;
  dimensions: string;
  commodity: string;
  specialRequirements: string;
}

export default function NewLoadForm({
  isNewLoadOpen,
  setIsNewLoadOpen,
}: {
  isNewLoadOpen: boolean;
  setIsNewLoadOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([
    { type: "pickup", address: "" },
    { type: "dropoff", address: "" },
  ]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [rateConfirmation, setRateConfirmation] = useState<File | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [loadDetails, setLoadDetails] = useState<LoadDetails>({
    weight: "",
    temperature: "",
    dimensions: "",
    commodity: "",
    specialRequirements: "",
  });

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

  const handleLoadDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setLoadDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Submitting load:", {
      selectedClient,
      locations,
      selectedDriver,
      rateConfirmation,
      loadDetails,
    });
    setIsNewLoadOpen(false);
  };

  return (
    <Sheet open={isNewLoadOpen} onOpenChange={setIsNewLoadOpen}>
      <SheetTrigger asChild>
        <Button size={"xs"} variant={"minimal"}>
          New Load
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-2">
          <SheetTitle>Add New Load</SheetTitle>
          <SheetDescription>
            Enter the details for the new load.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-3.5">
          <div className="flex flex-col gap-4 p-1">
            <div className="flex flex-col items-start justify-center gap-4">
              <Label htmlFor="client" className="text-gray-500 text-start">
                Client
              </Label>
              <Select
                required
                onValueChange={setSelectedClient}
                value={selectedClient}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Client 1</SelectItem>
                  <SelectItem value="client2">Client 2</SelectItem>
                  {/* TODO: Fetch and populate actual clients */}
                </SelectContent>
              </Select>
            </div>

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
                      placeholder={`Enter ${location.type} address`}
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

            <Button
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              variant="outline"
              className="w-full"
            >
              {isDetailsVisible ? "Hide Load Details" : "Show Load Details"}
            </Button>

            {isDetailsVisible && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gray-500">
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    value={loadDetails.weight}
                    onChange={handleLoadDetailsChange}
                    placeholder="Enter load weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-gray-500">
                    Temperature Requirements
                  </Label>
                  <Input
                    id="temperature"
                    value={loadDetails.temperature}
                    onChange={handleLoadDetailsChange}
                    placeholder="Enter temperature requirements"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-gray-500">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={loadDetails.dimensions}
                    onChange={handleLoadDetailsChange}
                    placeholder="Enter load dimensions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commodity" className="text-gray-500">
                    Commodity
                  </Label>
                  <Input
                    id="commodity"
                    value={loadDetails.commodity}
                    onChange={handleLoadDetailsChange}
                    placeholder="Enter commodity type"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="specialRequirements"
                    className="text-gray-500"
                  >
                    Special Requirements
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    value={loadDetails.specialRequirements}
                    onChange={handleLoadDetailsChange}
                    placeholder="Enter any special requirements"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col items-start justify-center gap-4">
              <Label htmlFor="driver" className="text-gray-500 text-start">
                Driver
              </Label>
              <Select
                required
                onValueChange={setSelectedDriver}
                value={selectedDriver}
              >
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
              <Textarea
                id="instructions"
                placeholder="Enter any special instructions for the driver"
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <Label htmlFor="price" className="text-gray-500 text-start">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter load price"
                required
              />
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
