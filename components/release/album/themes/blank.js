// Blank theme - sample template for new themes
// This theme uses all default components but can be customized
// by overriding specific components below.
//
// A theme object supports:
//   name          - string identifier (matches the `theme` field in a release JSON)
//   components     - map of component overrides (falls back to default for anything omitted)
//   fontClassName  - optional string of next/font CSS-variable classes applied to the page root
//
// Special component slots handled by the layout:
//   ThemeBackground - optional component rendered as a fixed, full-viewport layer behind
//                     all content (pointer-events disabled). Use it for animated backgrounds.
//
// Example: to override ReleaseHead and add a background, uncomment and customize:
// import CustomReleaseHead from '../release-head';
// import MyBackground from './my-background';
//
// export default {
// 	name: 'blank',
// 	fontClassName: '',
// 	components: {
// 		ReleaseHead: CustomReleaseHead,
// 		ThemeBackground: MyBackground,
// 		// Other components fall back to default
// 	},
// };

const blankTheme = {
	name: 'blank',
	components: {},
};

export default blankTheme;
