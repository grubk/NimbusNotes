declare module "html-to-docx" {
  const htmlToDocx: (
    html: string,
    fileName?: string | null,
    options?: {
      orientation?: "portrait" | "landscape"
      table?: {
        row?: {
          cantSplit?: boolean
        }
      }
      footer?: boolean
      pageNumber?: boolean
    }
  ) => Promise<Buffer>

  export default htmlToDocx
}
