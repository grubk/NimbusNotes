import Link from "next/link"
import Image from "next/image"
import { SearchInput } from "./search-input"
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"


export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-full w-full">
            <div className="flex gap-3 items-center shrink-0 pr-6">
                <Link href="/home">
                    <Image src="/assets/nimbuscloud.png" alt="Cloud Logo" width={36} height={36}/>
                </Link>
                <h3 className="text-xl font-light text-sky-500">Nimbus Notes</h3>
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
