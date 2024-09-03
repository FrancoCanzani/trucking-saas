"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewLoadForm from "@/components/forms/new-load-form";

const mockLoads = [
  {
    id: 1,
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "In Transit",
    driver: "John Doe",
  },
  {
    id: 2,
    origin: "Chicago, IL",
    destination: "Houston, TX",
    status: "Pending",
    driver: "Jane Smith",
  },
  {
    id: 3,
    origin: "Miami, FL",
    destination: "Seattle, WA",
    status: "Delivered",
    driver: "Bob Johnson",
  },
  {
    id: 4,
    origin: "Boston, MA",
    destination: "San Francisco, CA",
    status: "In Transit",
    driver: "Alice Brown",
  },
  {
    id: 5,
    origin: "Denver, CO",
    destination: "Atlanta, GA",
    status: "Pending",
    driver: "Charlie Wilson",
  },
];

export default function Dashboard() {
  const [isNewLoadOpen, setIsNewLoadOpen] = useState(false);
  const [isNewDriverOpen, setIsNewDriverOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trucking SaaS Dashboard</h1>
        <div className="space-x-2">
          <NewLoadForm
            isNewLoadOpen={isNewLoadOpen}
            setIsNewLoadOpen={setIsNewLoadOpen}
          />
          <Sheet open={isNewDriverOpen} onOpenChange={setIsNewDriverOpen}>
            <SheetTrigger asChild>
              <Button>New Driver</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Driver</SheetTitle>
                <SheetDescription>
                  Enter the details for the new driver.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="license" className="text-right">
                    License Number
                  </Label>
                  <Input id="license" className="col-span-3" />
                </div>
              </div>
              <Button onClick={() => setIsNewDriverOpen(false)}>
                Add Driver
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        <h2 className="text-xl font-semibold mb-4">Current Loads</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLoads.map((load) => (
              <TableRow key={load.id}>
                <TableCell>{load.id}</TableCell>
                <TableCell>{load.origin}</TableCell>
                <TableCell>{load.destination}</TableCell>
                <TableCell>{load.status}</TableCell>
                <TableCell>{load.driver}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
