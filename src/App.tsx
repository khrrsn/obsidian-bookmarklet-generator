import { useCallback, useState } from 'react'
import {
	Anchor,
	Button,
	Grid,
	Center,
	Table,
	Title,
	Text,
	Container,
	TextInput,
	Textarea,
	Switch,
	Space,
	Modal,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { generateScript } from './helpers'

const variables = {
	'timestamp': 'Timestamp bookmark is run.',
	'url': 'Current Page URL',
	'pageTitle': 'Document Page Title',
	'og:site_name': 'Site Name',
	'og:description': 'Site description',
}

const defaultPageTitle = `{pageTitle}`
const defaultTemplate = `---
created: {date}
source: {og:site_name}
link: {url}
---

# {pageTitle}

> {og:description}`

export default function Demo() {
	const [generated, setGenerated] = useState('')
	const [isModalOpened, setModalOpen] = useState(false)
	const handleModalClose = useCallback(() => setModalOpen(false), [])

	const form = useForm({
		initialValues: {
			pageTitle: defaultPageTitle,
			content: defaultTemplate,
			directory: 'Articles',
			vaultName: '',
			isSiriShortcut: false,
		},
	})

	const handleGenerate = useCallback(values => {
		setGenerated(generateScript(values))
		setModalOpen(true)
	}, [])

	return (
		<Container>
			<Title sx={{ fontSize: 40, fontWeight: 900, letterSpacing: -1 }} align="center" mt={40}>
				<Text inherit variant="gradient" component="span">
					Obsidian
				</Text>{' '}
				Bookmarklet Generator
			</Title>

			<Space h="md" />

			<form onSubmit={form.onSubmit(handleGenerate)}>
				<Grid gutter="xl">
					<Grid.Col sm={4}>
						<strong>Variables</strong>
						<br />
						<small>
							You may use all the variables below, all other open graph tags are also
							accepted.
						</small>
						<br />
						<br />

						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(variables).map(([key, description]) => (
									<tr key={key}>
										<td>
											<code>{key}</code>
										</td>
										<td>{description}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Grid.Col>
					<Grid.Col sm={8}>
						<p>
							This bookmarklet generator is powered via the{' '}
							<Anchor
								href="https://github.com/Vinzent03/obsidian-advanced-uri"
								target="_blank"
							>
								Advanced URI
							</Anchor>{' '}
							plugin.
						</p>
						<TextInput
							className="form-row"
							required
							label="Page Title"
							{...form.getInputProps('pageTitle')}
							description="Page title created from the URL."
						/>
						<Textarea
							className="form-row"
							required
							label="Template"
							{...form.getInputProps('content')}
							description="Content generated by Obisdian."
							autosize
						/>
						<TextInput
							className="form-row"
							required
							label="Obsidian Directory"
							description="Directory the articles will get added to in Obsidian, please make sure the directory exists to work properly."
							{...form.getInputProps('directory')}
						/>
						<TextInput
							className="form-row"
							label="Obsidian Vault Name"
							description="Optionally declare the vault name."
							{...form.getInputProps('vaultName')}
						/>

						<Switch
							className="form-row"
							label="Generate as a Siri Shortcut"
							{...form.getInputProps('isSiriShortcut')}
						/>

						<Center className="form-row">
							<Button size="lg" variant="gradient" type="submit">
								Generate
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</form>
			{/* variables */}

			<Modal
				size="lg"
				opened={isModalOpened}
				onClose={handleModalClose}
				title="Generated Script"
			>
				<Textarea value={generated} autosize readOnly />
				<h4>How to use?</h4>
				<p>
					{form.values.isSiriShortcut ? (
						<>
							You can copy the base template by following{' '}
							<Anchor
								href="https://www.icloud.com/shortcuts/411ecbe6a3074ad88ce287a81439ef44"
								target="_blank"
							>
								this link
							</Anchor>{' '}
							and replacing the script with the generated script above.
						</>
					) : (
						<>
							Drag <Anchor href={encodeURI(generated)}>Save to Obsidian</Anchor> to
							your bookmark bar.
						</>
					)}
				</p>
			</Modal>
		</Container>
	)
}
