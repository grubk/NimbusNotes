import { TableCell, TableRow } from "@/components/ui/table"
import { Doc } from "../../../convex/_generated/dataModel"
import { Building2Icon, CircleUserIcon, FileText} from "lucide-react"
import { format } from "date-fns"
import { DocumentMenu } from "./document-menu"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ReactDOM from "react-dom"
import { TransitionDown } from "@/components/transitiondown"


interface DocumentRowProps {
    doc: Doc<"documents">
}

export const DocumentRow = ({ doc }: DocumentRowProps) => {
    const router = useRouter()
    const [showTransition, setShowTransition] = useState(false)

const handleClick = () => {
    setShowTransition(true); // start the transition
        setTimeout(() => {
          router.push(`/documents/${doc._id}`)
        }, 500)

  }

    return (
        <>
              {/* Portal the transition overlay to document.body */}
              {showTransition &&
                ReactDOM.createPortal(
                  <TransitionDown
                    duration={0}
                    className="fixed top-0 left-0 w-screen h-screen z-[9999]"
                  />,
                  document.body
                )}
        <TableRow
            className="cursor-pointer"
            onClick={
                () => handleClick()}
        >
            <TableCell className="w-[50px]">
                <FileText className="size-6 text-blue-500" />
            </TableCell>
            <TableCell className="font-medium md:w-[45%]">
                {doc.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {doc.organizationId ? <Building2Icon className="size-4"/> : <CircleUserIcon className="size-4"/>}
                {doc.organizationId ? "Organization" : "Personal"}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell items-center">
                {format(new Date(doc._creationTime), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex justify-end">
                <DocumentMenu
                    documentId={doc._id}
                    title={doc.title}
                    onNewTab={() => window.open(`/documents/${doc._id}`, "_blank")}
                />
            </TableCell>
        </TableRow>
        </>
    )
}

