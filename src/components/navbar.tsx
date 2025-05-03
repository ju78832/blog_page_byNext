"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg ml-10">
          Blog Platform
        </Link>

        <nav className="flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) ||
                          session.user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
