declare global {
    interface Window {
        UglifyJS: any
    }
}

const script = `
    let filePath = '__directory__/__title__'
    let content = 'testing'

    const variables = {
        date: new Date().toISOString(),
        url: window.location.href,
        pageTitle: document.title
    }

    const meta = Array.from(document.querySelectorAll('meta'))
    for(const item of meta) {
        const property = item.getAttribute('property') || ''

        if(!property.startsWith('og:')) {
            continue
        }

        variables[property] = item.content
    }

    for(const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(\`{\${key}}\`, 'g')
        filePath = filePath.replace(regex, value)
        content = content.replace(regex, value)
    }

    const params = {
        data: content,
        filepath: filePath,
        mode: 'new',
        vault: __vault__
    }

    const querystring = Object.entries(params)
	.filter(([key, value]) => !!value)
    .map(([key, value]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`)
    .join('&')

    const url = \`obsidian://advanced-uri?\${querystring}\`
`

export function generateScript(data: any) {
	const template = script
		.replace('__content__', data.content.replace(/\n/g, '__line__'))
		.replace('__vault__', !data.vault ? 'void 0' : `'${data.vault}'`)
		.replace('__directory__', data.directory)
		.replace('__title__', data.pageTitle)

	if (data.isSiriShortcut) {
		return `
			var result = [];
			${template}
			result.push(url);
			completion(result);
		`
	}

	const { code } = window.UglifyJS.minify(template)
	return `javascript:(function(){${code}window.location.href=url;})();`
}
