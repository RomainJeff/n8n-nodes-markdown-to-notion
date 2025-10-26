# n8n-nodes-markdown-to-notion

This is an n8n community node that converts Markdown to Notion blocks using the [Martian library](https://github.com/tryfabric/martian).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Manual Installation

To get started locally:

```bash
# Clone the repository
git clone https://github.com/RomainJeff/n8n-nodes-markdown-to-notion.git
cd n8n-nodes-markdown-to-notion

# Install dependencies
npm install

# Build the node
npm run build

# Start n8n with the node loaded
npm run dev
```

## Operations

The **Markdown to Notion** node provides a single operation to convert Markdown content into Notion blocks.

### Convert Markdown to Notion Blocks

Transforms Markdown text (including GitHub Flavored Markdown) into Notion API-compatible block objects.

**Features:**
- Supports headings, paragraphs, lists, code blocks, tables, and more
- Handles inline formatting (bold, italic, strikethrough, inline code, links)
- Processes GitHub Flavored Markdown (GFM) extensions
- Configurable options for image handling and content truncation

## Node Parameters

### Markdown Source
Choose where to get the Markdown content from:
- **Input Field**: Read Markdown from a field in the input data
- **Direct Input**: Paste or type Markdown content directly

### Markdown Field
*Only visible when "Input Field" is selected*

The name of the field containing the Markdown content (e.g., `markdown`, `content`, `body`).

### Markdown Content
*Only visible when "Direct Input" is selected*

The Markdown text to convert to Notion blocks. Supports multi-line input.

### Output Field Name
The field name where the converted Notion blocks will be stored. Default: `notionBlocks`

### Strict Image URLs
Whether to render invalid image URLs as text instead of image blocks. Default: `false`

### Truncate Long Content
Automatically truncate content that exceeds Notion's API limits. Default: `true`

## Usage Example

### Basic Conversion

1. Add the **Markdown to Notion** node to your workflow
2. Choose "Direct Input" as the Markdown Source
3. Enter your Markdown content:
   ```markdown
   # Welcome to n8n

   This is a **bold** statement with *italic* text.

   - Item 1
   - Item 2
   - Item 3
   ```
4. The node outputs Notion blocks in the `notionBlocks` field

### With Input Data

If you have Markdown content from a previous node:

1. Set Markdown Source to "Input Field"
2. Enter the field name containing your Markdown (e.g., `body`)
3. The node will convert the Markdown and add the `notionBlocks` field to your data

### Integration with Notion API

Use this node before calling the Notion API to create or update pages:

```
[Trigger] → [Get Markdown Content] → [Markdown to Notion] → [Notion API: Create Page]
```

The output `notionBlocks` array can be used directly as the `children` parameter in Notion's API.

## Supported Markdown Features

- **Headings** (H1-H3)
- **Paragraphs** with inline formatting
- **Lists** (ordered and unordered)
- **Code blocks** with syntax highlighting
- **Tables**
- **Block quotes**
- **Images** (with URL validation option)
- **Inline formatting**: bold, italic, strikethrough, inline code, links
- **GitHub Flavored Markdown** extensions

## Compatibility

Tested with n8n version 1.0.0+

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Martian library documentation](https://github.com/tryfabric/martian)
- [Notion API reference](https://developers.notion.com/reference/intro)

## Development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run with hot reload
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Version History

### 0.1.0
- Initial release
- Markdown to Notion blocks conversion
- Support for input field or direct input
- Configurable image handling and truncation options

## License

[MIT](LICENSE.md)
