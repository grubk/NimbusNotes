import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { redirect } from "next/navigation"

import { Id } from "../../../../convex/_generated/dataModel"
import { Document } from "./document"
import { api } from "../../../../convex/_generated/api"
import { ConvexError } from "convex/values"

interface DocumentIdPageProps {
    params: Promise<{ documentId: Id<"documents"> }>
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
    const { documentId } = await params
    const { getToken } = await auth()
    const token = await getToken({ template: "convex" }) ?? undefined

    if (!token) {
        redirect("/home")
    }

    try {
        const preloadedDocument = await preloadQuery(
            api.documents.getById,
            {id: documentId},
            {token},
        )
    

    return <Document preloadedDocument={preloadedDocument}/>
    } catch (err) {
        if (err instanceof ConvexError && err.message === "Document not found") {
            redirect("/home")
        }
    }

    throw new Error("Cannot find document")
}

export default DocumentIdPage