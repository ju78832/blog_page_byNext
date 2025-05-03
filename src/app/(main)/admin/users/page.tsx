import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers } from "@/lib/actions";
import { checkAdmin } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default async function AdminUsersPage() {
  await checkAdmin();
  const users = await getUsers();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {/* Add user management actions here */}
                <Button variant="outline" size="sm">
                  Edit Role
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
