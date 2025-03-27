import { Plugin, Notice, TFile } from 'obsidian';
import { convertToHtml } from 'mammoth';

export default class DocxImporterPlugin extends Plugin {
    async onload() {
        console.log('Loading DOCX Importer plugin');

        // Add ribbon icon
        this.addRibbonIcon('file-text', 'Import DOCX', async () => {
            await this.importDocx();
        });

        // Add command to palette
        this.addCommand({
            id: 'import-docx',
            name: 'Import DOCX to Markdown',
            callback: async () => await this.importDocx()
        });
    }

    async importDocx() {
        try {
            // Create file input for selecting DOCX file
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.docx';
            fileInput.click();

            fileInput.onchange = async () => {
                if (!fileInput.files?.length) return;
                
                const file = fileInput.files[0];
                new Notice(`Processing ${file.name}...`);
                
                // Read file as array buffer
                const buffer = await file.arrayBuffer();
                
                try {
                    new Notice('Converting DOCX to Markdown...');
                    // First convert DOCX to HTML
                    const result = await convertToHtml({
                        arrayBuffer: buffer
                    });
                    const html = result.value;
                    // Convert HTML to Markdown
                    const markdown = this.htmlToMarkdown(html);
                    
                    // Handle warnings if any
                    if (result.messages.length > 0) {
                        console.log('Conversion warnings:', result.messages);
                    }
                    
                    // Create markdown filename
                    const fileName = file.name.replace(/\.docx$/i, '.md');
                    
                    // Check if file already exists
                    const existingFile = this.app.vault.getAbstractFileByPath(fileName);
                    
                    if (existingFile instanceof TFile) {
                        // Simplified file comparison
                        const existingContent = await this.app.vault.read(existingFile);
                        
                        // Simple content comparison
                        if (existingContent.trim() === markdown.trim()) {
                            new Notice(`File ${fileName} already contains the same content`);
                        } else {
                            // Basic merge strategy - append with separator
                            const mergedContent = `${existingContent}\n\n---\n\n${markdown}`;
                            await this.app.vault.modify(existingFile, mergedContent);
                            new Notice(`Updated existing file: ${fileName}`);
                        }
                    } else {
                        // Create new file
                        await this.app.vault.create(fileName, markdown);
                        new Notice(`Created new file: ${fileName}`);
                    }
                } catch (err: any) {
                    new Notice(`Error converting file: ${err.message}`);
                    console.error('DOCX conversion error:', err);
                }
            };
        } catch (error: any) {
            new Notice(`Error importing DOCX: ${error.message}`);
            console.error('DOCX import error:', error);
        }
    }

    onunload() {
        console.log('Unloading DOCX Importer plugin');
    }

    private htmlToMarkdown(html: string): string {
        // Basic HTML to Markdown conversion
        return html
            .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
            .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
            .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
            .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
            .replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n')
            .replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
            .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
            .replace(/<ul>(.*?)<\/ul>/gis, (_, content) => content.replace(/<li>(.*?)<\/li>/gi, '- $1\n'))
            .replace(/<ol>(.*?)<\/ol>/gis, (_, content) => content.replace(/<li>(.*?)<\/li>/gi, '1. $1\n'))
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>') // Preserve underline tags
            .replace(/<(?!\/?u>)[^>]+>/g, '') // Remove any remaining HTML tags except underline
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    }
}
