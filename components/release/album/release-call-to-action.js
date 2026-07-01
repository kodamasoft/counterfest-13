import Link from 'next/link';
import Trans from 'next-translate/Trans';

const PHYSICAL_STORE_NAMES = [
	'AKIBA-HOBBY',
	'Diverse Direct',
	'Bandcamp (Physical)',
];

function StoreButton({ storeItem }) {
	return (
		<Link
			key={storeItem[0]}
			href={storeItem[1].link}
			className="inline-block text-center text-lg rounded border-2 py-3 px-8 m-1 transition text-[color:var(--release-color)] border-[color:var(--release-color)] hover:text-white hover:bg-[color:var(--release-color)]"
		>
			{storeItem[1].name}
		</Link>
	);
}

export default function ReleaseCallToAction({ store }) {
	const entries = Object.entries(store);
	const physical = entries.filter((s) =>
		PHYSICAL_STORE_NAMES.includes(s[1].name)
	);
	const digital = entries.filter(
		(s) => !PHYSICAL_STORE_NAMES.includes(s[1].name)
	);

	return (
		<section className="bg-current/5 mt-16 py-8">
			<h2 className="text-2xl text-center uppercase mb-6 font-black">
				<Trans i18nKey="release:available_now" />
			</h2>

			<div className="text-center">
				{physical.length > 0 && (
					<>
						<span className="text-2xl block font-bold p-2">
							PHYSICAL
						</span>
						{physical.map((storeItem) => (
							<StoreButton
								key={storeItem[0]}
								storeItem={storeItem}
							/>
						))}
					</>
				)}
				{digital.length > 0 && (
					<>
						{physical.length > 0 && (
							<span className="text-2xl font-bold block p-2">
								DIGITAL
							</span>
						)}
						{digital.map((storeItem) => (
							<StoreButton
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
