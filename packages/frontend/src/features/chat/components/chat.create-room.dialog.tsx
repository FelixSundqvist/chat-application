import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog.tsx";
import { Input } from "@/components/input.tsx";
import { Button } from "@/components/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import { useState } from "react";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";

const formSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
});

function DialogForm({ onClose }: { onClose: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    resetOptions: {
      keepErrors: false,
    },
    mode: "onBlur",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await callFirebaseFunction("createPrivateChatRoom", {
        name: data.name,
        invitedEmails: [data.email],
      });
    } catch (e) {
      toast.error((e as Error).message);
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat room name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User to invite</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-4">
          <DialogClose>Cancel</DialogClose>
          <Button variant="default" type="submit" disabled={isSubmitting}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function CreateChatRoomDialog() {
  const [isOpen, setOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger className="truncate text-left font-semibold mt-2 p-2 text-sm">
        + Create new room
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new chat room</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new private chat room and invite a user to join.
        </DialogDescription>
        <DialogForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateChatRoomDialog;
