'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const mockClients = [
  { id: 1, name: 'Acme Inc.', email: 'contact@acme.com', address: '123 Business Rd, Suite 100, Business City, 12345', phone: '123-456-7890' },
  { id: 2, name: 'Stark Industries', email: 'tony@stark.com', address: '10880 Malibu Point, 90265, CA', phone: '212-970-4133' },
  { id: 3, name: 'Wayne Enterprises', email: 'bruce@wayne.com', address: '1007 Mountain Drive, Gotham City', phone: '555-228-626' },
  { id: 4, name: 'Cyberdyne Systems', email: 'info@cyberdyne.com', address: '2144 Kramer St., Los Angeles, CA', phone: '800-555-0199' },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<(typeof mockClients[0]) | null>(null);
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingClient(null);
    }
    setOpen(isOpen);
  };

  const handleAddOrUpdateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
    };

    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...client, ...clientData } : client
      );
      setClients(updatedClients);
      toast({ title: 'Client Updated!', description: 'The client information has been saved.' });
    } else {
      // Add new client
      const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        ...clientData,
      };
      setClients([...clients, newClient]);
      toast({ title: 'Client Added!', description: 'The new client has been saved.' });
    }
    handleOpenChange(false);
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast({ title: 'Client Deleted', description: 'The client has been removed.', variant: 'destructive'});
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Clients</h1>
            <p className="text-muted-foreground">Manage your clients here.</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={() => setOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddOrUpdateClient}>
              <DialogHeader>
                <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                <DialogDescription>
                  {editingClient ? 'Update the details of your client.' : 'Enter the details of your new client.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" className="col-span-3" defaultValue={editingClient?.name} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" name="email" type="email" className="col-span-3" defaultValue={editingClient?.email} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input id="address" name="address" className="col-span-3" defaultValue={editingClient?.address} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input id="phone" name="phone" className="col-span-3" defaultValue={editingClient?.phone} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save client</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setEditingClient(client); setOpen(true); }}>Edit</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this client.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
