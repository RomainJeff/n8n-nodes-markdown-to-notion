import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { markdownToBlocks } from '@tryfabric/martian';

export class MarkdownToNotion implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Markdown to Notion',
		name: 'markdownToNotion',
		icon: { light: 'file:markdown.svg', dark: 'file:markdown.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Transform Markdown to Notion blocks using the Martian library',
		defaults: {
			name: 'Markdown to Notion',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Markdown Source',
				name: 'markdownSource',
				type: 'options',
				options: [
					{
						name: 'Input Field',
						value: 'field',
					},
					{
						name: 'Direct Input',
						value: 'direct',
					},
				],
				default: 'field',
				description: 'Where to get the markdown content from',
			},
			{
				displayName: 'Markdown Field',
				name: 'markdownField',
				type: 'string',
				default: 'markdown',
				displayOptions: {
					show: {
						markdownSource: ['field'],
					},
				},
				description: 'The field containing the markdown content',
				placeholder: 'e.g., markdown, content, body',
			},
			{
				displayName: 'Markdown Content',
				name: 'markdownContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				displayOptions: {
					show: {
						markdownSource: ['direct'],
					},
				},
				description: 'The markdown content to convert',
				placeholder: '# Heading\n\nParagraph text...',
			},
			{
				displayName: 'Output Field Name',
				name: 'outputField',
				type: 'string',
				default: 'notionBlocks',
				description: 'The field name where the Notion blocks will be stored',
			},
			{
				displayName: 'Strict Image URLs',
				name: 'strictImageUrls',
				type: 'boolean',
				default: false,
				description: 'Whether to render invalid images as text',
			},
			{
				displayName: 'Truncate Long Content',
				name: 'truncate',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically truncate content that exceeds Notion\'s limits',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const markdownSource = this.getNodeParameter('markdownSource', itemIndex) as string;
				const outputField = this.getNodeParameter('outputField', itemIndex) as string;
				const strictImageUrls = this.getNodeParameter('strictImageUrls', itemIndex) as boolean;
				const truncate = this.getNodeParameter('truncate', itemIndex) as boolean;

				let markdownContent: string;

				// Get markdown content based on source
				if (markdownSource === 'field') {
					const markdownField = this.getNodeParameter('markdownField', itemIndex) as string;
					const item = items[itemIndex];
					markdownContent = item.json[markdownField] as string;

					if (!markdownContent) {
						throw new NodeOperationError(
							this.getNode(),
							`Field '${markdownField}' not found or empty in input data`,
							{ itemIndex },
						);
					}
				} else {
					markdownContent = this.getNodeParameter('markdownContent', itemIndex) as string;
				}

				if (!markdownContent || typeof markdownContent !== 'string') {
					throw new NodeOperationError(
						this.getNode(),
						'Markdown content must be a non-empty string',
						{ itemIndex },
					);
				}

				// Convert markdown to Notion blocks using Martian
				const notionBlocks = markdownToBlocks(markdownContent, {
					strictImageUrls,
					notionLimits: {
						truncate,
					},
				});

				// Create output item
				const newItem: INodeExecutionData = {
					json: {
						...items[itemIndex].json,
						[outputField]: notionBlocks,
					},
					pairedItem: itemIndex,
				};

				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							...items[itemIndex].json,
							error: error.message,
						},
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
