import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DeniedPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don't have permission to view this page
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
