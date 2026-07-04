import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <Card className="p-6">

      <h2 className="font-semibold text-lg mb-4">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-3">

        <Button>
          New Project
        </Button>

        <Button variant="outline">
          New Task
        </Button>

      </div>

    </Card>
  );
}