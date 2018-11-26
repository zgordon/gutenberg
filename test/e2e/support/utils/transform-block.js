/**
 * Transforms the current selected block in the block whose title is blockTitle.
 *
 * @param {string} blockTitle Title of the destination block of the transformation.
 */
export const transformBlock = async ( blockTitle ) => {
	await page.click( '.editor-block-toolbar .editor-block-switcher' );
	await page.click(
		`.editor-block-types-list .editor-block-types-list__list-item button[aria-label="${ blockTitle }"]`
	);
};
