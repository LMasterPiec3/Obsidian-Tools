# DOCX Markdown Importer for Obsidian

A simple and efficient plugin to import DOCX files into your Obsidian vault by converting them to Markdown format.

## Features

- Convert DOCX to Markdown with formatting preserved
- Intelligent file handling (create new or merge with existing)
- Content comparison and smart merging
- Progress indicators during conversion
- Simple one-click import from ribbon or command palette

## Installation

### From Obsidian Community Plugins
1. Open Obsidian Settings > Community Plugins
2. Disable Safe Mode if prompted
3. Click "Browse" and search for "DOCX Markdown Importer"
4. Install the plugin and enable it

### Manual Installation
1. Download the latest release from the GitHub repository
2. Extract the ZIP file into your `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian Settings > Community Plugins

## Usage

### Importing a DOCX File
1. Click the document icon in the left ribbon, or
2. Use the command palette (Ctrl/Cmd+P) and search for "Import DOCX file"
3. Select your DOCX file when prompted
4. The plugin will convert it and save as a Markdown file in your vault

### File Handling
- If no file with the same name exists, a new markdown file will be created
- If a file already exists, the plugin will compare the content and:
  - Skip if content is identical
  - Merge the content if different (original content followed by new content)

## Troubleshooting

### Common Issues

- **File not importing**: 
  - Ensure your file is a valid .docx format
  - Check that you have sufficient permissions to read the file

- **Formatting issues**:
  - Complex document formatting may not convert perfectly
  - Tables, images, and special formatting may require manual adjustment

- **Plugin not showing**:
  - Verify the plugin is enabled in Settings > Community Plugins
  - Restart Obsidian if needed

### Getting Help
If you encounter issues not covered here, please:
1. Check the console log for error messages (View > Toggle Developer Tools)
2. Report issues on the GitHub repository with details about your problem

## License

This project is licensed under the MIT License - see the LICENSE file for details.

