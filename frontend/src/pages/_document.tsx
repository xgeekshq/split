import { Head, Html, Main, NextScript } from 'next/document';

import { getCssText } from 'styles/stitches/stitches.config';

export default function Document() {
	return (
		<Html>
			<Head>
				<link crossOrigin="true" href="https://fonts.googleapis.com" rel="preconnect" />
				<link crossOrigin="true" href="https://fonts.gstatic.com" rel="preconnect" />
				<link
					crossOrigin="true"
					href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>
				<link href="/favicon.svg" rel="shortcut icon" type="image/svg+xml" />
				<style dangerouslySetInnerHTML={{ __html: getCssText() }} id="stitches" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
