import { Head, Html, Main, NextScript } from 'next/document';

import { getCssText } from 'styles/stitches/stitches.config';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
				<link
					href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
					rel="stylesheet"
					crossOrigin="true"
				/>
				<link
					rel="shortcut icon"
					href="/Users/danielsousa/Developer/open-source/divide-and-conquer/frontend/public/favicon.svg"
					type="image/svg+xml"
				/>
				<style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
