/* eslint-disable no-undef,import/no-extraneous-dependencies */
/* global module */
/* eslint no-console:0 */

;(function() {
	const React = require('react')
	const ReactDOM = require('react-dom')
	const AppContainer = require('react-hot-loader').AppContainer

	const Demo = require('./main').default

	// Needed for React Developer Tools (Chrome Extension)
	window.React = React

	// Render the main app react component into the app div
	ReactDOM.render(
		<AppContainer>
			<Demo />
		</AppContainer>,
		document.getElementById('container')
	)

	if (module && module.hot) {
		module.hot.accept('./main.js', () => {
			const App = require('./main.js').default
			ReactDOM.render(
				<AppContainer>
					<App />
				</AppContainer>,
				document.getElementById('container')
			)
		})
	}
})()
