import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { checkAdmin } from "@/lib/actions";

export default async function AdminDashboard() {
  await checkAdmin();

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/admin/posts">
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>Manage Posts</CardTitle>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/create-post">
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
