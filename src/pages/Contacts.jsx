"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import * as ContactsApi from '../services/ContactsApi';
import * as JobsApi from '../services/JobsApi';  
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const STATUS_OPTIONS = {
  PROSPECT: "Prospect",
  QUALIFIED_LEAD: "Qualified Lead",
  CUSTOMER: "Customer",
};

const Contacts = () => {
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: STATUS_OPTIONS.PROSPECT,
  });
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery(['contacts'], () => ContactsApi.fetchContacts());

  const createContactMutation = useMutation({
    mutationFn: async (newContact) => {
      const { data, error } = await ContactsApi.createContact(newContact);
      if (error) throw error;

      // Check if the new contact is a customer and create a job if none exists
      if (data[0].status === STATUS_OPTIONS.CUSTOMER) {
        const jobExists = await JobsApi.checkJobForContact(data[0].id);
        if (!jobExists) {
          await JobsApi.createJobForContact(data[0].id);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      toast.success('Contact added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    createContactMutation.mutate(newContact);
    setNewContact({ first_name: '', last_name: '', email: '', phone: '', status: STATUS_OPTIONS.PROSPECT });
  };

  // Define columns for the data table
 const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => row.getValue("first_name"),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => row.getValue("last_name"),
    },
    {
      accessorKey: "email",
      header: () => (
        <div>
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.getValue("phone"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredContacts = contacts.filter(contact => 
    contact.first_name.toLowerCase().includes(search.toLowerCase()) || 
    contact.last_name.toLowerCase().includes(search.toLowerCase()) || 
    contact.email.toLowerCase().includes(search.toLowerCase())
  );

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Contact</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddContact} className="space-y-4">
            <Input
              placeholder="First Name"
              value={newContact.first_name}
              onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
              required
            />
            <Input
              placeholder="Last Name"
              value={newContact.last_name}
              onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <Select
              value={newContact.status}
              onValueChange={(value) => setNewContact({ ...newContact, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS_OPTIONS.PROSPECT}>Prospect</SelectItem>
                <SelectItem value={STATUS_OPTIONS.QUALIFIED_LEAD}>Qualified Lead</SelectItem>
                <SelectItem value={STATUS_OPTIONS.CUSTOMER}>Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add Contact</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex items-center">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-md border">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>{header.isPlaceholder ? null : header.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4">
            <span>
              {table.getPagination().pageIndex + 1} of {table.getPagination().getPageCount()}
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </Button>
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </Button>
              <Button
                onClick={() => table.setPageIndex(table.getPagination().getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
