import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface ExtractionResult {
  text: string;
  fileName: string;
  success: boolean;
  error?: string;
  processingTime: number;
}

async function extractFromPDF(file: File): Promise<ExtractionResult> {
  const start = Date.now();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      fullText += text + '\n';
    }

    return {
      text: fullText.trim(),
      fileName: file.name,
      success: true,
      processingTime: Date.now() - start,
    };
  } catch (error) {
    return {
      text: '',
      fileName: file.name,
      success: false,
      error: `Failed to extract from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      processingTime: Date.now() - start,
    };
  }
}

async function extractFromDOCX(file: File): Promise<ExtractionResult> {
  const start = Date.now();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages && result.messages.length > 0) {
      const errorMessages = result.messages
        .filter((m: any) => m.type === 'error')
        .map((m: any) => m.message);
      if (errorMessages.length > 0) {
        console.warn('DOCX extraction warnings:', errorMessages);
      }
    }

    const text = result.value.trim();

    if (!text) {
      throw new Error('No text content found in DOCX file');
    }

    return {
      text,
      fileName: file.name,
      success: true,
      processingTime: Date.now() - start,
    };
  } catch (error) {
    return {
      text: '',
      fileName: file.name,
      success: false,
      error: `Failed to extract from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`,
      processingTime: Date.now() - start,
    };
  }
}

async function extractFromImage(file: File): Promise<ExtractionResult> {
  const start = Date.now();
  try {
    const { Tesseract } = await import('tesseract.js');

    const worker = await Tesseract.createWorker('eng');
    const result = await worker.recognize(file);
    const text = result.data.text;

    await worker.terminate();

    return {
      text: text.trim(),
      fileName: file.name,
      success: true,
      processingTime: Date.now() - start,
    };
  } catch (error) {
    return {
      text: '',
      fileName: file.name,
      success: false,
      error: `Failed to extract from image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      processingTime: Date.now() - start,
    };
  }
}

export async function extractResumeText(file: File): Promise<ExtractionResult> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractFromPDF(file);
  }

  // DOCX files
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractFromDOCX(file);
  }

  // Image files
  if (fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)) {
    return extractFromImage(file);
  }

  // Text files
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    try {
      const text = await file.text();
      return {
        text: text.trim(),
        fileName: file.name,
        success: true,
        processingTime: 0,
      };
    } catch (error) {
      return {
        text: '',
        fileName: file.name,
        success: false,
        error: `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        processingTime: 0,
      };
    }
  }

  return {
    text: '',
    fileName: file.name,
    success: false,
    error: 'Unsupported file type. Please upload PDF, DOCX, image, or text file.',
    processingTime: 0,
  };
}
