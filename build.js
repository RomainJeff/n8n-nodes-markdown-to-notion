const esbuild = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
	console.log('Building n8n node with bundled dependencies...');

	// First, run TypeScript compilation to get type definitions
	console.log('Step 1: Generating TypeScript definitions...');
	execSync('tsc --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });

	// Then, bundle the JavaScript with all dependencies using esbuild
	console.log('Step 2: Bundling with esbuild...');

	await esbuild.build({
		entryPoints: ['nodes/MarkdownToNotion/MarkdownToNotion.node.ts'],
		bundle: true,
		platform: 'node',
		target: 'node18',
		format: 'cjs',
		outfile: 'dist/nodes/MarkdownToNotion/MarkdownToNotion.node.js',
		external: ['n8n-workflow'], // Keep n8n-workflow as peer dependency
		sourcemap: false,
		minify: false, // Keep readable for debugging
	});

	// Copy icon files if they exist
	const iconsDir = 'nodes/MarkdownToNotion';
	const outputIconsDir = 'dist/nodes/MarkdownToNotion';

	fs.mkdirSync(outputIconsDir, { recursive: true });

	['markdown.svg', 'markdown.dark.svg'].forEach(icon => {
		const iconPath = path.join(iconsDir, icon);
		if (fs.existsSync(iconPath)) {
			fs.copyFileSync(iconPath, path.join(outputIconsDir, icon));
			console.log(`Copied ${icon}`);
		}
	});

	console.log('Build complete! All dependencies are now bundled.');
}

build().catch((error) => {
	console.error('Build failed:', error);
	process.exit(1);
});
