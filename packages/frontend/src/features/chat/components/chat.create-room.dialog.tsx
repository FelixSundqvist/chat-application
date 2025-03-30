import { Button } from "@/components/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
});

function DialogForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

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
      await callFirebaseFunction("createChatRoom", {
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
              <FormLabel>{t("Chat.CreateRoomDialog.name")}</FormLabel>
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
            {t("Common.create")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function CreateChatRoomDialog() {
  const { t } = useTranslation("translations", {
    keyPrefix: "Chat.CreateRoomDialog",
  });
  const [isOpen, setOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger className="truncate text-left font-semibold mt-2 p-2 text-sm">
        + {t("title")}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
        <DialogForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateChatRoomDialog;
