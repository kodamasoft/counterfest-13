import LocaleSwitcher from '../../locale-switcher';
import Link from 'next/link';
import Image from 'next/image';

export default function ReleaseNav({ ...props }) {
	return (
		<div {...props}>
			<header className="container mx-auto px-4">
				<div className="flex justify-between items-center">
					<Link href="/">
						<Image
							src="/assets/Logo_Orange_Transparent.png"
							width={100}
							height={100}
							alt="CounterfestRecords"
							quality={100}
						/>
					</Link>
					<div className="flex items-center bg-neutral-700/50 rounded-lg p-2">
						<LocaleSwitcher />
					</div>
				</div>
			</header>
		</div>
	);
}
