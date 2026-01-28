import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MerchantNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <h2 className="text-4xl font-bold">404</h2>
          <p className="mt-2 text-muted-foreground">
            This page doesn&apos;t exist in your dashboard.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/merchant">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
