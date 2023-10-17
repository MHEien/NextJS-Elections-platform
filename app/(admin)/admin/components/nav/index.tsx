import { MainNav } from "./main-nav";
import TeamSwitcher from "./team-switcher";
import { UserNav } from "./user-nav";

export default function Navigation() {
    return (
        <>
          <div className="hidden flex-col md:flex">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <TeamSwitcher />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>
          </div>
        </>
    );
}