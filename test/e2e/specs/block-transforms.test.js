/**
 * External dependencies
 */
import path from 'path';
import {
	intersection,
	mapValues,
	pickBy,
	some,
} from 'lodash';

/**
 * Internal dependencies
 */
import {
	getAllBlocks,
	getAvailableBlockTransforms,
	getBlockTitle,
	getEditedPostContent,
	hasBlockSwitcher,
	newPost,
	setPostContent,
	selectBlockByClientId,
	transformBlock,
} from '../support/utils';
import {
	getFileBaseNames,
	readFixtureFile,
} from '../../support/utils';
import { EXPECTED_TRANSFORMS } from './fixtures/block-transforms';

/*
* Returns true if the fileBase refers to a fixture of a block
* that should not be handled e.g: because of being deprecated,
* or because of being a block that tests an error state.
*/
const isAnExpectedUnhandledBlock = ( fixturesDir, fileBase ) => {
	if ( fileBase.includes( 'deprecated' ) ) {
		return true;
	}
	const parsedBlockObject = JSON.parse(
		readFixtureFile( fixturesDir, fileBase + '.parsed.json' )
	)[ 0 ];
	return some(
		[
			null,
			'core/block',
			'core/column',
			'core/freeform',
			'core/text-columns',
			'core/subhead',
			'core/text',
			'unregistered/example',
		],
		( blockName ) => parsedBlockObject.blockName === blockName
	);
};

const setPostContentAndSelectBlock = async ( content ) => {
	await setPostContent( content );
	const blocks = await getAllBlocks();
	const clientId = blocks[ 0 ].clientId;
	await page.click( '.editor-post-title .editor-post-title__block' );
	await selectBlockByClientId( clientId );
};

const getTransformStructureFromFile = async ( fixturesDir, fileBase ) => {
	if ( isAnExpectedUnhandledBlock( fixturesDir, fileBase ) ) {
		return null;
	}
	const content = readFixtureFile( fixturesDir, fileBase + '.html' );
	await setPostContentAndSelectBlock( content );
	const block = ( await getAllBlocks() )[ 0 ];
	const availableTransforms = await getAvailableBlockTransforms();
	const originalBlock = await getBlockTitle( block.name );

	return {
		availableTransforms,
		originalBlock,
		content,
	};
};

const getTransformResult = async ( blockContent, transformName ) => {
	await setPostContentAndSelectBlock( blockContent );
	expect( await hasBlockSwitcher() ).toBe( true );
	await transformBlock( transformName );
	return getEditedPostContent();
};

describe( 'test transforms', () => {
	const fixturesDir = path.join(
		__dirname, '..', '..', 'integration', 'full-content', 'fixtures'
	);

	// Todo: Remove the intersect as soon as all fixtures are corrected,
	// and its direct usage on the editor does not trigger errors.
	// Currently some fixtures trigger errors (mainly media related)
	// because when loaded in the editor,
	// some requests are triggered that have a 404 response.
	const fileBasenames = intersection(
		getFileBaseNames( fixturesDir ),
		[
			'core__code',
			'core__paragraph__align-right',
		]
	);

	const transformStructure = {};
	beforeAll( async () => {
		await newPost();

		for ( const fileBase of fileBasenames ) {
			const structure = await getTransformStructureFromFile(
				fixturesDir,
				fileBase
			);
			if ( ! structure ) {
				continue;
			}
			transformStructure[ fileBase ] = structure;
			await setPostContent( '' );
			await page.click( '.editor-post-title .editor-post-title__block' );
		}
	} );

	it( 'should contain the expected transforms', async () => {
		expect(
			mapValues(
				pickBy(
					transformStructure,
					( { availableTransforms } ) => availableTransforms,
				),
				( { availableTransforms, originalBlock } ) => {
					return { originalBlock, availableTransforms };
				}
			)
		).toEqual( EXPECTED_TRANSFORMS );
	} );

	describe( 'individual transforms work as expected', () => {
		beforeAll( async () => {
			await newPost();
		} );

		beforeEach( async () => {
			await setPostContent( '' );
			await page.click( '.editor-post-title .editor-post-title__block' );
		} );

		for ( const [ fixture, { originalBlock, availableTransforms } ] of Object.entries( EXPECTED_TRANSFORMS ) ) {
			for ( const transform of availableTransforms ) {
				it( `${ originalBlock } block should transform to ${ transform } block. fixture: ${ fixture }`,
					async () => {
						const { content } = transformStructure[ fixture ];
						expect(
							await getTransformResult( content, transform )
						).toMatchSnapshot();
					}
				);
			}
		}
	} );
} );
