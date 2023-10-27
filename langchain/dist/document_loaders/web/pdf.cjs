"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPDFLoader = void 0;
const document_js_1 = require("../../document.cjs");
const base_js_1 = require("../base.cjs");
const document_js_2 = require("../../util/document.cjs");
/**
 * A document loader for loading data from PDFs.
 */
class WebPDFLoader extends base_js_1.BaseDocumentLoader {
    constructor(blob, { splitPages = true, pdfjs = PDFLoaderImports } = {}) {
        super();
        Object.defineProperty(this, "blob", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "splitPages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "pdfjs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.blob = blob;
        this.splitPages = splitPages ?? this.splitPages;
        this.pdfjs = pdfjs;
    }
    /**
     * Loads the contents of the PDF as documents.
     * @returns An array of Documents representing the retrieved data.
     */
    async load() {
        const { getDocument, version } = await this.pdfjs();
        const parsedPdf = await getDocument({
            data: new Uint8Array(await this.blob.arrayBuffer()),
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
        }).promise;
        const meta = await parsedPdf.getMetadata().catch(() => null);
        const documents = [];
        for (let i = 1; i <= parsedPdf.numPages; i += 1) {
            const page = await parsedPdf.getPage(i);
            const content = await page.getTextContent();
            if (content.items.length === 0) {
                continue;
            }
            const text = content.items
                .map((item) => item.str)
                .join("\n");
            documents.push(new document_js_1.Document({
                pageContent: text,
                metadata: {
                    pdf: {
                        version,
                        info: meta?.info,
                        metadata: meta?.metadata,
                        totalPages: parsedPdf.numPages,
                    },
                    loc: {
                        pageNumber: i,
                    },
                },
            }));
        }
        if (this.splitPages) {
            return documents;
        }
        if (documents.length === 0) {
            return [];
        }
        return [
            new document_js_1.Document({
                pageContent: (0, document_js_2.formatDocumentsAsString)(documents),
                metadata: {
                    pdf: {
                        version,
                        info: meta?.info,
                        metadata: meta?.metadata,
                        totalPages: parsedPdf.numPages,
                    },
                },
            }),
        ];
        return documents;
    }
}
exports.WebPDFLoader = WebPDFLoader;
async function PDFLoaderImports() {
    try {
        const { default: mod } = await import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js");
        const { getDocument, version } = mod;
        return { getDocument, version };
    }
    catch (e) {
        console.error(e);
        throw new Error("Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`.");
    }
}
