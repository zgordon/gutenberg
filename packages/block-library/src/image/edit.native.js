/**
 * External dependencies
 */
import { View, Image } from 'react-native';

/**
 * Internal dependencies
 */
import { MediaPlaceholder } from '@wordpress/editor';

export default function ImageEdit( props ) {
	const { attributes, onMediaLibraryPress, onUploadPress } = props;
	const { url } = attributes;

	if ( ! url ) {
		return (
			<MediaPlaceholder
				onUploadPress={ onUploadPress }
				onMediaLibraryPress={ onMediaLibraryPress }
			/>
		);
	}

	return (
		<View style={ { flex: 1 } }>
			<Image
				style={ { width: '100%', height: 200 } }
				resizeMethod="scale"
				source={ { uri: url } }
			/>
		</View>
	);
}
