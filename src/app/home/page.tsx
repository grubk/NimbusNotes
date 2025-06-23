"use client"

import { Navbar } from "./navbar"
import { TemplateGallery } from "./template-gallery"
import { usePaginatedQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { DocumentsTable } from "./documents-table"
import { useSearchParam } from "@/hooks/use-search-param"



const Home = () => {
  const [search] = useSearchParam()
  const {
    results,
    status,
    loadMore } = usePaginatedQuery(api.documents.get, {search}, { initialNumItems: 5 })


  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed left-0 right-0 z-30 h-16 bg-white p-4 border-b-2 border-sky-500">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
          <DocumentsTable 
            documents={results}
            loadMore={loadMore}
            status={status}
          />
      </div>
    </div>
  )
}

export default Home