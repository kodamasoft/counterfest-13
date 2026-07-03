import Link from 'next/link';
import Trans from 'next-translate/Trans';

const PHYSICAL_STORE_NAMES = [
	'AKIBA-HOBBY',
	'Diverse Direct',
	'Bandcamp (Physical)',
];

function PixelButton({ storeItem }) {
	return (
		<Link
			href={storeItem[1].link}
			className="heroes-pixel-btn inline-block text-center m-2 uppercase tracking-wider"
		>
			{storeItem[1].name}
		</Link>
	);
}

export default function CounterfestHeroesCallToAction({ store }) {
	const entries = Object.entries(store);
	const physical = entries.filter((s) =>
		PHYSICAL_STORE_NAMES.includes(s[1].name)
	);
	const digital = entries.filter(
		(s) => !PHYSICAL_STORE_NAMES.includes(s[1].name)
	);

	return (
		<section className="heroes-cta mt-16 py-10">
			<h2 className="text-2xl text-center uppercase mb-8 font-black tracking-[0.25em]">
				<Trans i18nKey="release:available_now" />
			</h2>

			<div className="text-center">
				{physical.length > 0 && (
					<>
						<span className="heroes-cta__label block">
							PHYSICAL
						</span>
						{physical.map((storeItem) => (
							<PixelButton
								key={storeItem[0]}
								storeItem={storeItem}
							/>
						))}
					</>
				)}
				{digital.length > 0 && (
					<>
						{physical.length > 0 && (
							<span className="heroes-cta__label block">
								DIGITAL
							</span>
						)}
						{digital.map((storeItem) => (
							<PixelButton
								key={storeItem[0]}
								storeItem={storeItem}
							/>
						))}
					</>
				)}
			</div>
		</section>
	);
}
