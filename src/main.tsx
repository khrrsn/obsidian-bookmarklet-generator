import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const theme: MantineThemeOverride = {
	colorScheme: 'dark',
}

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
			<App />
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
)
