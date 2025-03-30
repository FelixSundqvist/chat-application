import { Button } from "@/components/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form.tsx";
import { Input } from "@/components/input.tsx";
import { useChatRooms } from "@/features/chat/context/chat-rooms.context.tsx";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

function DialogForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  const { roomId } = useChatRooms();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      await callFirebaseFunction("inviteUserToChatRoom", {
        email: data.email,
        roomId,
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Common.email")}</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-4">
          <DialogClose>{t("Common.cancel")}</DialogClose>
          <Button variant="default" type="submit" disabled={isSubmitting}>
            {t("Chat.InviteUserDialog.sendInvite")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function InviteUserDialog() {
  const { t } = useTranslation("translations", {
    keyPrefix: "Chat",
  });
  const [isOpen, setOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger className="truncate text-left font-semibold mt-2 p-2 text-sm text-white">
        + {t("InviteUserDialog.title")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("InviteUserDialog.title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t("InviteUserDialog.description")}
        </DialogDescription>
        <DialogForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default InviteUserDialog;
