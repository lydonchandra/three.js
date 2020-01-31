import {
	DefaultLoadingManager,
	LoaderUtils
} from "../../../build/three.module.js";

var B3DMLoader = ( function () {

	function B3DMLoader( manager, gltfLoader ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

		this.gltfLoader = gltfLoader;

	}

	B3DMLoader.prototype = {

		constructor: B3DMLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			this.gltfLoader.load.call( this, url, onLoad, onProgress, onError );

		},

		parse: function ( data, path, onLoad, onError ) {

			var magic = LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

			if ( magic === "b3dm" ) {

				try {

					var b3dm = new B3DMExtension( data );
					this.gltfLoader.parse( b3dm.bodyGlb, path, onLoad, onError );

				} catch ( error ) {

					if ( onError ) onError( error );
					return;

				}

			}

		}

	};

	var B3DM_HEADER_LENGTH = 28;

	function B3DMExtension( data ) {

		this.name = "b3dm";
		this.content = null;
		this.body = null;
		var headerView = new DataView( data, 0, B3DM_HEADER_LENGTH );

		this.header = {

			magic: LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true ),
			featureTableJSONByteLength: headerView.getUint32( 12, true ),
			featureTableBinaryByteLength: headerView.getUint32( 16, true ),
			batchTableJSONByteLength: headerView.getUint32( 20, true ),
			batchTableBinaryByteLength: headerView.getUint32( 24, true )

		};

		this.body = data.slice( B3DM_HEADER_LENGTH, this.header.length );

		var glbStartOffset = B3DM_HEADER_LENGTH + this.header.featureTableJSONByteLength + this.header.featureTableBinaryByteLength
			+ this.header.batchTableJSONByteLength + this.header.batchTableBinaryByteLength;

		this.bodyGlb = data.slice( glbStartOffset, this.header.length );

	}

	return B3DMLoader;

} )();

export { B3DMLoader };

