import { Button } from "@/components/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card.tsx";
import { Input } from "@/components/input.tsx";
import { Label } from "@/components/label.tsx";
import Page from "@/components/page.tsx";

import { sendEmailLink, signInWithGoogle } from "@/lib/firebase/auth.tsx";
import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function SignInPage() {
  const [emailSent, setEmailSent] = useState(false);

  const { t } = useTranslation("translations", {
    keyPrefix: "SignIn",
  });

  async function onEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    await sendEmailLink(email as string);
    setEmailSent(true);
  }

  const signInPageClass = "bg-gradient-to-r from-indigo-500 to-blue-400";

  if (emailSent)
    return (
      <Page className={signInPageClass}>
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("linkSent")}</CardTitle>
            <CardDescription className="flex gap-2 flex-col">
              {t("checkYourEmail")}
            </CardDescription>
          </CardHeader>
        </Card>
      </Page>
    );

  return (
    <Page className={signInPageClass}>
      <Card className="w-[350px] bg-background">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("welcome")}</CardTitle>
          <CardDescription className="flex gap-2 flex-col">
            {t("signIn")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-6 flex-col">
          <form className="flex flex-col gap-4" onSubmit={onEmailSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("Form.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-xl">
              {t("signIn")}
            </Button>
          </form>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 px-2 text-muted-foreground">
              {t("orContinueWith")}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              className="w-full rounded-xl"
              onClick={signInWithGoogle}
              variant="outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {t("google")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}

export default SignInPage;
