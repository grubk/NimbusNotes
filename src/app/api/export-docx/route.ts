import { NextRequest, NextResponse } from "next/server";
import htmlToDocx from "html-to-docx";

export async function POST(req: NextRequest) {
  try {
    const { html, filename } = await req.json();

    if (!html) {
      return new NextResponse("Missing HTML content", { status: 400 });
    }

    const tableBorderStyles = `
      <style>
        table {
          border-collapse: collapse;
          border: 1px solid black;
        }
        th, td {
          border: 1px solid black;
          padding: 5px;
        }
      </style>
    `;

    let fullHtml = html;

    if (html.includes("<head>")) {
      fullHtml = html.replace("<head>", `<head>${tableBorderStyles}`);
    } else if (html.includes("<html>")) {
      fullHtml = html.replace("<html>", `<html><head>${tableBorderStyles}</head>`);
    } else {
      fullHtml = `
        <html>
          <head>${tableBorderStyles}</head>
          <body>${html}</body>
        </html>
      `;
    }

    const docxBuffer = await htmlToDocx(fullHtml);

    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename || "document"}.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
