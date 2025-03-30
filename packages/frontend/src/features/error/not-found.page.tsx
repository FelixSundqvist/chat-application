import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation("translations", {
    keyPrefix: "Error",
  });
  return (
    <div>
      <h1>{t("notFound")}</h1>
    </div>
  );
}

export default NotFoundPage;
