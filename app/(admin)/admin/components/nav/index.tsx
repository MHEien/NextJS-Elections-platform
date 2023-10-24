import { MainNav } from "./main-nav";
import TeamSwitcher from "./team-switcher";
import { UserNav } from "./user-nav";
import { ModeToggle } from "@/components/ModeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminLink from "./AdminLink";

export default async function Navigation() {

  const session = await getServerSession(authOptions);

  const role = session?.user?.role;

    return (
        <>
          <div className="hidden flex-col md:flex">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <TeamSwitcher />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  {role === "ADMIN" && (
                    <AdminLink />
                  )}
                  <ModeToggle />
                  <UserNav />
                </div>
              </div>
            </div>
          </div>
        </>
    );
}