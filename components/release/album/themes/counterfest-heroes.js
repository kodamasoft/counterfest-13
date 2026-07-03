// counterfest-heroes theme
// Signature: a full-viewport pixel-art "+" starfield (scroll-parallax) behind the
// page, tech/industrial typography, and pixel-art call-to-action buttons.
import CounterfestHeroesStarfield from './counterfest-heroes-starfield';
import CounterfestHeroesCallToAction from './counterfest-heroes-call-to-action';
import { heroesFontVars } from './counterfest-heroes-fonts';

const counterfestHeroesTheme = {
	name: 'counterfest-heroes',
	// Injected as CSS-variable classes on the page root by the layout.
	fontClassName: heroesFontVars,
	components: {
		// Full-viewport background layer (fixed, behind content).
		ThemeBackground: CounterfestHeroesStarfield,
		// Pixel-art store buttons.
		ReleaseCallToAction: CounterfestHeroesCallToAction,
		// Everything else falls back to the default components.
	},
};

export default counterfestHeroesTheme;
