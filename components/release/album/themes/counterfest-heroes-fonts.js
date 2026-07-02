// Typography for the counterfest-heroes theme: Lato (bold for headers).
import { Lato } from 'next/font/google';

export const lato = Lato({
	subsets: ['latin'],
	weight: ['400', '700', '900'],
	style: ['normal', 'italic'],
	variable: '--font-lato',
});

export const heroesFontVars = lato.variable;
