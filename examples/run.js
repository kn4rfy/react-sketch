/* eslint-disable no-undef,import/no-extraneous-dependencies */
/* global module */
/* eslint no-console:0 */

;(function() {
	const React = require('react')
	const ReactDOM = require('react-dom')
	const injectTapEventPlugin = require('react-tap-event-plugin')
	const AppContainer = require('react-hot-loader').AppContainer

	const Demo = require('./main').default

	// Needed for React Developer Tools (Chrome Extension)
	window.React = React

	/* Some components use react-tap-event-plugin to listen for touch events.
	 This dependency is temporary and will go away once react v1.0 is released.
	 Until then, be sure to inject this plugin at the start of your app */
	injectTapEventPlugin()

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
