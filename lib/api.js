import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const releasesDirectory = join(process.cwd(), '_releases');
const projectsDirectory = join(process.cwd(), '_projects');

/* PROJECTS */

export function getProjectSlugs() {
	// list all unique slugs from all projects
	return fs.readdirSync(projectsDirectory);
}

export function getProjectBySlug(slug, locale) {
	// get the project file depending on the locale
	const realSlug = slug.replace(/\.mdx$/, '');

	let fullPath = null;
	// check that the jp file exists
	if (
		locale == 'jp' &&
		fs.existsSync(join(projectsDirectory, `${realSlug}.jp.mdx`))
	) {
		fullPath = join(projectsDirectory, `${realSlug}.jp.mdx`);
	} else {
		fullPath = join(projectsDirectory, `${realSlug}.mdx`);
	}

	// read the project file
	const fileContents = fs.readFileSync(fullPath, 'utf8');

	return fileContents;
}

/* RELEASES */
export function getReleaseSlugs() {
	return fs.readdirSync(releasesDirectory);
}

export function getReleaseBySlug(slug) {
	const realSlug = slug.replace(/\.json$/, '');
	const fullPath = join(releasesDirectory, `${realSlug}.json`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	return JSON.parse(fileContents);
}

export function getAllReleases() {
	const slugs = getReleaseSlugs();
	const releases = slugs.map((slug) => getReleaseBySlug(slug));
	return releases;
}
