import { useTranslation } from "react-i18next";

function SelectRoom() {
  const { t } = useTranslation("translations", {
    keyPrefix: "Chat",
  });
  return (
    <div className="flex flex-col items-center justify-center gap-6 dark:text-gray-100 h-full">
      <h1 className="font-bold text-4xl">{t("welcomeToTheChatApp")}</h1>
      <p>{t("selectARoom")}</p>
    </div>
  );
}

export default SelectRoom;
