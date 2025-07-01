"use client"

import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from '@/contexts/app-context';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from '@/types/inventory';

const formSchema = z.object({
  assignee: z.string().min(1, "Debes seleccionar o crear un usuario."),
  notes: z.string().optional(),
});

type BulkAssignModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: any[];
  onSuccess: () => void;
};

export function BulkAssignModal({ open, onOpenChange, selectedProducts, onSuccess }: BulkAssignModalProps) {
  const { state, addUserToUsersData } = useApp();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { assignee: "", notes: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Datos de Asignación Masiva:", {
      productIds: selectedProducts.map(p => p.id),
      ...values,
    });
    onSuccess();
    onOpenChange(false);
  }

  const handleCreateNewUser = (newLabel: string) => {
    const newId = Date.now();
    const newUser: User = {
      id: newId,
      nombre: newLabel,
      email: `${newLabel.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      rol: "Lector"
    };
    addUserToUsersData(newUser);
    return newId;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Asignar {selectedProducts.length} Producto(s)
          </DialogTitle>
          <DialogDescription>
            Asigna los productos seleccionados a un usuario. Puedes buscar un usuario existente o crear uno nuevo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Asignar a</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                          {field.value ? state.usersData.find(u => u.id === Number(field.value))?.nombre : "Seleccionar usuario..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command
                        filter={(value, search) => {
                          const user = state.usersData.find(u => u.id === Number(value));
                          if (!user) return 0;
                          return user.nombre.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
                        }}
                      >
                        <CommandInput
                          placeholder="Buscar o crear usuario..."
                          value={inputValue}
                          onValueChange={setInputValue}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {inputValue && (
                              <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="ghost"
                                onClick={() => {
                                  const newLabel = inputValue;
                                  if (newLabel) {
                                    const newValue = handleCreateNewUser(newLabel);
                                    form.setValue("assignee", String(newValue));
                                    setPopoverOpen(false);
                                    setInputValue("");
                                  }
                                }}>
                                <UserPlus className="h-4 w-4" />
                                Crear usuario "{inputValue}"
                              </Button>
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {state.usersData.map((user) => (
                              <CommandItem value={String(user.id)} key={user.id} onSelect={() => {
                                form.setValue("assignee", String(user.id));
                                setPopoverOpen(false);
                                setInputValue("");
                              }}>
                                <Check className={cn("mr-2 h-4 w-4", String(user.id) === field.value ? "opacity-100" : "opacity-0")} />
                                {user.nombre}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Motivo de la asignación, ubicación, etc." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Asignar Productos</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
