import Page from "@/components/ui/page.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const navigate = useNavigate();
  return (
    <Page>
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chatly</CardTitle>
          <CardDescription>
            Sign in with your Microsoft or Google account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              className="w-full rounded-xl"
              onClick={() => navigate("/chats")}
            >
              Sign in with Google
            </Button>
            <Button
              className="w-full rounded-xl"
              onClick={() => navigate("/chats")}
            >
              Sign in with Microsoft
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}

export default SignInPage;
