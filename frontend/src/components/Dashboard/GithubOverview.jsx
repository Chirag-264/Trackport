import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export default function GithubOverview() {

  // Later GitHub API
  const commits = 157;

  return (
    <Card className="p-6">

      <h2 className="font-semibold text-lg mb-4">
        GitHub Overview
      </h2>

      <div className="flex gap-3 items-center">

        <GitBranch />

        <div>
          <h3 className="font-bold">
            {commits} Commits
          </h3>

          <p className="text-muted-foreground">
            This month
          </p>
          
        </div>

      </div>

    </Card>
  );
}