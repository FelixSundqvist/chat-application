import { Button } from "@/components/button.tsx";
import { signOut } from "@/lib/firebase/auth.tsx";
import { useTranslation } from "react-i18next";

function GenericError() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <h1 className="font-bold text-2xl">{t("Error.genericError")}</h1>
      <Button onClick={signOut}>{t("Common.signOut")}</Button>
    </div>
  );
}

export default GenericError;
