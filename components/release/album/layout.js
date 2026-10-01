import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { getTheme } from './themes';

import { Noto_Sans_JP } from 'next/font/google';

const noto = Noto_Sans_JP({
	subsets: ['latin'],
	weight: ['400', '900'],
	variable: '--font-noto',
});

// `layout.content_width` caps the credits and footer, which otherwise run the
// full container width and leave huge gaps between the columns.
const CONTENT_WIDTHS = {
	default: 'none',
	narrow: '56rem',
	compact: '42rem',
};

// `background.image_size` keywords. "width" spans the page width at the
// image's own ratio, so a transparent flair image is never stretched.
const BACKGROUND_SIZES = {
	cover: 'cover',
	width: '100% auto',
	contain: 'contain',
	auto: 'auto',
};

// Builds the page background from the release's `background` block. Every key
// is optional; with none of them set the page renders as it always has
// (image covering the whole page, centred).
function getBackgroundStyle(background = {}) {
	if (!background.image) {
		return { backgroundImage: 'none' };
	}

	const position = background.image_position || 'center';
	const overlay = Number(background.overlay) || 0;
	const layers = [`url(${background.image})`];
	const sizes = [BACKGROUND_SIZES[background.image_size] || 'cover'];

	// A flat dark layer above the image keeps text readable over busy art.
	if (overlay > 0) {
		layers.unshift(
			`linear-gradient(rgb(0 0 0 / ${overlay}), rgb(0 0 0 / ${overlay}))`
		);
		sizes.unshift('auto');
	}

	return {
		backgroundImage: layers.join(', '),
		backgroundSize: sizes.join(', '),
		// "top" / "bottom" / "center" anchor the image vertically; anything
		// else is passed through as a raw CSS background-position.
		backgroundPosition: ['top', 'bottom', 'center'].includes(position)
			? `center ${position}`
			: position,
		backgroundRepeat: background.image_repeat ? 'repeat' : 'no-repeat',
		backgroundAttachment: background.image_attachment || 'scroll',
		// Room left under the footer so a bottom-anchored image is not covered
		// by text, e.g. "35vw" for an image 35% as tall as it is wide.
		...(background.bottom_space && {
			paddingBottom: background.bottom_space,
		}),
	};
}

export default function ReleaseLayout({ release }) {
	const { t } = useTranslation('release');
	const { locale } = useRouter();

	// Get theme from release or default to 'default'
	const themeName = release.theme || 'default';
	const theme = getTheme(themeName);

	// Get theme components (custom theme components override defaults)
	const ReleaseHead = theme.components.ReleaseHead;
	const ReleaseDescription = theme.components.ReleaseDescription;
	const ReleaseCallToAction = theme.components.ReleaseCallToAction;
	const ReleaseTracklist = theme.components.ReleaseTracklist;
	const ReleaseYouTubeEmbed = theme.components.ReleaseYouTubeEmbed;
	const ReleaseCredits = theme.components.ReleaseCredits;
	const ReleaseFooter = theme.components.ReleaseFooter;
	// Optional full-viewport background layer provided by a theme
	const ThemeBackground = theme.components.ThemeBackground;

	// Handle localized title with fallback (title may be a { en, jp } object)
	const getLocalizedTitle = (title) => {
		if (typeof title === 'object' && title !== null) {
			return (
				title[locale] || title.en || title.jp || Object.values(title)[0]
			);
		}
		return title;
	};
	const localizedTitle = getLocalizedTitle(release.title);

	const backgroundColor =
		release.background && release.background.color
			? release.background.color
			: '232426';
	const backgroundStyle = getBackgroundStyle(release.background);
	const contentWidth =
		CONTENT_WIDTHS[release.layout?.content_width] || CONTENT_WIDTHS.default;
	// `layout.hide` lists sections to leave out, e.g. ["call_to_action"].
	const hidden = new Set(release.layout?.hide || []);
	const youtubeEmbed = release.youtube_id && !hidden.has('youtube') && (
		<ReleaseYouTubeEmbed youtube={release.youtube_id} />
	);
	const youtubeFirst =
		release.layout?.youtube_position === 'before_tracklist';
	const panelColors = [
		release.background?.panel_color &&
			`--release-panel-color: #${release.background.panel_color};`,
		release.background?.panel_text_color &&
			`--release-panel-text-color: #${release.background.panel_text_color};`,
	]
		.filter(Boolean)
		.join('\n');

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicons/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicons/favicon-16x16.png"
				/>
				<title>{localizedTitle + ' - COUNTERFEST RECORDS'}</title>
				<meta
					property="og:title"
					content={localizedTitle + ' - COUNTERFEST RECORDS'}
				/>
				<meta name="theme-color" content={'#' + release.color} />
				<meta property="og:image" content={release.cover} />
				<meta
					property="og:description"
					content={t(release.slug + '.desc')}
				/>
				<meta property="og:type" content="website" />
				<style
					dangerouslySetInnerHTML={{
						__html: `
						:root {
							--release-color: #${release.color};
							--background-color: #${backgroundColor};
							--release-content-width: ${contentWidth};
							${panelColors}
						}
					`,
					}}
				/>
			</Head>
			{ThemeBackground && (
				<div
					className={`theme-${themeName} ${theme.fontClassName || ''} fixed inset-0 -z-10 pointer-events-none`}
					aria-hidden="true"
				>
					<ThemeBackground release={release} />
				</div>
			)}
			<div
				className={`${noto.variable} ${theme.fontClassName || ''} theme-${themeName} font-release min-h-screen pb-1`}
				style={{
					color: `#${release.background?.text_color || 'ffffff'}`,
					backgroundColor: `#${backgroundColor}`,
					...backgroundStyle,
				}}
			>
				<ReleaseHead
					slug={release.slug}
					title={release.title}
					logo={release.logo}
					header={release.header}
					description={release.description}
					sc_track_id={release.soundcloud_track_id}
					color={release.color}
					layout={release.layout}
					hidden={hidden}
				/>
				{!hidden.has('description') && (
					<ReleaseDescription
						cover={release.cover}
						title={release.title}
						circle={release.circle}
						specification={release.specification}
						release_date={release.release_date}
						catalog={release.catalog}
						price={release.price}
						store={release.store}
						booth={release.booth}
					/>
				)}
				{!hidden.has('call_to_action') && (
					<ReleaseCallToAction
						store={release.store}
						buttonStyle={release.layout?.button_style}
					/>
				)}
				{youtubeFirst && youtubeEmbed}
				{!hidden.has('tracklist') && (
					<ReleaseTracklist
						tracklist={release.tracklist}
						bonus_tracklist={release.bonus_tracklist}
						scene={release.scene}
						suppressHydrationWarning={true}
					/>
				)}
				{!youtubeFirst && youtubeEmbed}
				{!hidden.has('credits') && release.credits && (
					<ReleaseCredits credits={release.credits} />
				)}
				<ReleaseFooter
					slug={release.slug}
					footer_string={release.footer}
					title={release.title}
				/>
			</div>
		</>
	);
}
