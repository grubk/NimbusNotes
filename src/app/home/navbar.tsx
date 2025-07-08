import { SearchInput } from "./search-input"
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"


export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-full w-full">
            <div className="flex gap-3 items-center shrink-0 pr-6">
                <h3 className="text-xl font-light text-blue-500">Nimbus Notes</h3>
            </div>
            <SearchInput />
            <div className="flex gap-3 items-center pl-6">
                <OrganizationSwitcher
                    afterCreateOrganizationUrl="/home"
                    afterLeaveOrganizationUrl="/home"
                    afterSelectOrganizationUrl="/home"
                    afterSelectPersonalUrl="/home"
                />
                <UserButton />
            </div>
        </nav>
    )
}
