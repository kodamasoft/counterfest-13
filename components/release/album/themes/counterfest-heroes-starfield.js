import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
	Particles,
	ParticlesProvider,
	useParticlesProvider,
} from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { loadImageShape } from '@tsparticles/shape-image';

// --- Star shapes (vectors) -------------------------------------------------
// Each shape is an inline SVG with the fill color baked in per instance (we
// don't use replaceColor — it doesn't reliably recolor here). Swap a path or
// add an entry to change/extend the shapes.
const svg = (body, size) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${body}</svg>`
	)}`;

// Four-point sparkle (the "sparkle emoji" silhouette, but vector)
const sparkle = (color) =>
	svg(
		`<path d="M6 0C6.6 4.2 7.8 5.4 12 6C7.8 6.6 6.6 7.8 6 12C5.4 7.8 4.2 6.6 0 6C4.2 5.4 5.4 4.2 6 0Z" fill="${color}"/>`,
		12
	);
// Small cluster of dots
const cluster = (color) =>
	svg(
		`<g fill="${color}"><circle cx="3" cy="4" r="1.1"/><circle cx="8.5" cy="2.5" r="0.9"/><circle cx="6" cy="7.6" r="1.4"/><circle cx="10" cy="9" r="0.8"/><circle cx="2" cy="9.5" r="0.7"/></g>`,
		12
	);

// Image shapes tinted to a specific color.
function shapeImages(color) {
	return [
		{ src: sparkle(color), width: 12, height: 12 },
		{ src: cluster(color), width: 12, height: 12 },
	];
}

// --- Depth layers ----------------------------------------------------------
// `range` = total scroll-parallax travel in px (bounded, so a fixed background
// never reveals gaps regardless of page length). Deeper layers move much more
// for an aggressive parallax.
const LAYERS = [
	{
		count: 60,
		size: { min: 1.5, max: 3.5 },
		drift: 0.2,
		twinkle: 0.7,
		opacity: [0.15, 0.5],
		range: 200,
	},
	{
		count: 42,
		size: { min: 3, max: 7 },
		drift: 0.5,
		twinkle: 1,
		opacity: [0.25, 0.75],
		range: 650,
	},
	{
		count: 26,
		size: { min: 6, max: 12 },
		drift: 0.9,
		twinkle: 1.4,
		opacity: [0.45, 1],
		range: 1400,
	},
];

// Register the slim bundle + image shape once for the whole app.
const initEngine = async (engine) => {
	await loadSlim(engine);
	await loadImageShape(engine);
};

function buildOptions(layer, color, reduceMotion) {
	return {
		fullScreen: { enable: false },
		detectRetina: true,
		fpsLimit: 60,
		particles: {
			number: { value: layer.count },
			color: { value: color },
			shape: {
				// ~75% image shapes (sparkle / cluster), ~25% plain dots.
				type: ['image', 'image', 'image', 'circle'],
				options: {
					image: shapeImages(color),
				},
			},
			size: { value: layer.size },
			opacity: {
				value: { min: layer.opacity[0], max: layer.opacity[1] },
				animation: reduceMotion
					? { enable: false }
					: {
							enable: true,
							speed: layer.twinkle,
							sync: false,
							startValue: 'random',
							mode: 'auto',
						},
			},
			move: {
				enable: !reduceMotion,
				speed: layer.drift,
				direction: 'none',
				random: true,
				straight: false,
				outModes: { default: 'out' },
			},
		},
	};
}

function Layers({ base, reduceMotion }) {
	const { loaded } = useParticlesProvider();
	// One instance per depth layer. Memoized so instances aren't rebuilt per render.
	const optionsByLayer = useMemo(
		() => LAYERS.map((l) => buildOptions(l, base, reduceMotion)),
		[base, reduceMotion]
	);
	if (!loaded) return null;

	return (
		<>
			{LAYERS.map((layer, i) => (
				<div
					key={i}
					className="absolute left-0 right-0 top-0"
					style={{
						height: `calc(100vh + ${layer.range}px)`,
						transform: `translate3d(0, calc(var(--cf-progress, 0) * -${layer.range}px), 0)`,
						willChange: 'transform',
					}}
				>
					<Particles
						id={`cf-stars-${i}`}
						options={optionsByLayer[i]}
						className="w-full h-full"
					/>
				</div>
			))}
		</>
	);
}

export default function CounterfestHeroesStarfield({ release }) {
	const rootRef = useRef(null);
	const [base, setBase] = useState('#ffffff');
	const [reduceMotion, setReduceMotion] = useState(false);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		// Star color: read --star-color from this element (inside the theme
		// scope). Change that var in the theme CSS to re-tint the field.
		const styles = getComputedStyle(root);
		setBase(styles.getPropertyValue('--star-color').trim() || '#ffffff');

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		setReduceMotion(mq.matches);
		if (mq.matches) return; // static field, no scroll parallax

		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				raf = 0;
				const range = Math.max(
					1,
					document.documentElement.scrollHeight - window.innerHeight
				);
				const progress = Math.min(
					1,
					Math.max(0, window.scrollY / range)
				);
				root.style.setProperty('--cf-progress', String(progress));
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, [release?.color]);

	return (
		<div
			ref={rootRef}
			className="absolute inset-0 overflow-hidden"
			style={{ '--cf-progress': 0, background: '#0a0a12' }}
		>
			<ParticlesProvider init={initEngine}>
				<Layers base={base} reduceMotion={reduceMotion} />
			</ParticlesProvider>

			{/* Decorative character art pinned to the bottom-right of the
			    viewport. Sits inside the fixed, -z-10 ThemeBackground so it
			    reads as page background art. Desktop only — hidden below md
			    to keep mobile clean. */}
			<Image
				src="/assets/discography/logos/CFRC-0003-character.webp"
				alt=""
				aria-hidden="true"
				width={1200}
				height={1200}
				className="hidden md:block absolute bottom-0 right-0 h-[60vh] w-auto opacity-15 select-none"
			/>
		</div>
	);
}
