import Layout from '../components/layout';
import Head from 'next/head';
import Container from '../components/container';
import Header from '../components/header';
import ProseContainer from '../components/prose-container';
import Trans from 'next-translate/Trans';

import Link from 'next/link';
import Image from 'next/image';

import { WEBSITE_NAME } from '../lib/constants';

export default function Index() {
	return (
		<>
			<Layout>
				<Head>
					<title>{WEBSITE_NAME}</title>
				</Head>

				<Container>
					<Header />

					<div className="container pt-10 px-6 mx-auto">
						<ProseContainer>
							<p>
								<Trans
									i18nKey="common:home.description"
									components={{
										strong: <strong />,
										a: <Link href="/discord" />,
									}}
								/>
							</p>
							<h1 className="text-center mb-2">
								<Trans i18nKey="common:home.content.title" />
							</h1>
							<ul>
								<li>
									<Trans i18nKey="common:home.content.1" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.2" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.3" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.4" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.5" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.6" />
								</li>
								<li>
									<Trans i18nKey="common:home.content.7" />
								</li>
							</ul>
							<p>
								<Trans i18nKey="common:home.content.8" />
							</p>
						</ProseContainer>
					</div>
				</Container>
			</Layout>
		</>
	);
}