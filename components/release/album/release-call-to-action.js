import Link from 'next/link';
import Trans from 'next-translate/Trans';

const PHYSICAL_STORE_NAMES = [
	'AKIBA-HOBBY',
	'Diverse Direct',
	'Bandcamp (Physical)',
];

// A store's own `physical` flag wins; otherwise it is sorted by name.
function isPhysical(store) {
	return store.physical ?? PHYSICAL_STORE_NAMES.includes(store.name);
}

const BUTTON_STYLES = {
	outline:
		'text-[color:var(--release-color)] border-[color:var(--release-color)] hover:text-white hover:bg-[color:var(--release-color)]',
	filled: 'text-white bg-[color:var(--release-color)] border-[color:var(--release-color)] hover:opacity-80',
};

function StoreButton({ storeItem, buttonStyle }) {
	return (
		<Link
			key={storeItem[0]}
			href={storeItem[1].link}
			className={`inline-block text-center text-lg rounded border-2 py-3 px-8 m-1 transition ${BUTTON_STYLES[buttonStyle] || BUTTON_STYLES.outline}`}
		>
			{storeItem[1].name}
		</Link>
	);
}

export default function ReleaseCallToAction({ store, buttonStyle }) {
	const entries = Object.entries(store);
	const physical = entries.filter((s) => isPhysical(s[1]));
	const digital = entries.filter((s) => !isPhysical(s[1]));

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
								buttonStyle={buttonStyle}
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
								buttonStyle={buttonStyle}
							/>
						))}
					</>
				)}
			</div>
		</section>
	);
}
