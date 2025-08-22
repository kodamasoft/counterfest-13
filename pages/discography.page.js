import Layout from '../components/layout';
import Head from 'next/head';
import Container from '../components/container';
import Header from '../components/header';

import AlbumListing from '../components/album-listing';
import albumsJson from '/public/assets/discography/albums.json';

import { WEBSITE_NAME } from '../lib/constants';

export default function Discography() {
	// Order all the albums by release date (newest first)
	// Release date is in each album object as releaseDate with format 2020-12-30T00:00:00+0200 (ISO 8601)
	const legacyAlbums = {};
	const albums = {};

	Object.keys(albumsJson).forEach((key) => {
		const album = albumsJson[key];
		if (album.id.startsWith('KSDL')) {
			legacyAlbums[key] = album;
		} else {
			albums[key] = album;
		}
	});

	// Sort both albums and legacy albums by release date
	const sortedAlbums = Object.keys(albums)
		.sort((a, b) => {
			const dateA = new Date(albums[a].releaseDate);
			const dateB = new Date(albums[b].releaseDate);
			if (dateA.getTime() === dateB.getTime()) {
				// If release dates are the same, sort by catalog number in descending order
				return albums[b].id.localeCompare(albums[a].id);
			} else {
				return dateB.getTime() - dateA.getTime();
			}
		})
		.reduce((obj, key) => {
			obj[key] = albums[key];
			return obj;
		}, {});

	const sortedLegacyAlbums = Object.keys(legacyAlbums)
		.sort((a, b) => {
			const dateA = new Date(legacyAlbums[a].releaseDate);
			const dateB = new Date(legacyAlbums[b].releaseDate);
			if (dateA.getTime() === dateB.getTime()) {
				// If release dates are the same, sort by catalog number in descending order
				return legacyAlbums[b].id.localeCompare(legacyAlbums[a].id);
			} else {
				return dateB.getTime() - dateA.getTime();
			}
		})
		.reduce((obj, key) => {
			obj[key] = legacyAlbums[key];
			return obj;
		}, {});

	return (
		<Layout>
			<Head>
				<title>{WEBSITE_NAME}</title>
			</Head>
			<Container>
				<Header />
				<div className="container pt-10 px-6 mx-auto">
					<div className="flex flex-wrap">
						{Object.keys(sortedAlbums).map((key) => (
							<AlbumListing key={key} slug={key} />
						))}
					</div>
					<h2 className="text-lg font-bold mb-4">LEGACY ALBUMS</h2>
					<div className="flex flex-wrap">
						{Object.keys(sortedLegacyAlbums).map((key) => (
							<AlbumListing key={key} slug={key} />
						))}
					</div>
				</div>
			</Container>
		</Layout>
	);
}
