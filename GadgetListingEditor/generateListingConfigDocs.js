const path = require( 'path' );

/**
 * @param {string} str
 * @return {string}
 */
const escapeHtml = ( str ) => str
    .replace( /&/g, '&amp;' )
    .replace( /</g, '&lt;' )
    .replace( />/g, '&gt;' );

/**
 * TypeDoc's comment model changed shape across major versions (the modern
 * one is `comment.summary`, an array of display parts; older releases used
 * `comment.shortText`). Support both so this keeps working across upgrades.
 *
 * @param {import('typedoc').DeclarationReflection} reflection
 * @return {string}
 */
function getCommentText( reflection ) {
    const comment = reflection.comment;
    if ( !comment ) {
        return '';
    }
    if ( Array.isArray( comment.summary ) ) {
        return comment.summary.map( ( part ) => part.text || '' ).join( '' ).trim();
    }
    if ( typeof comment.shortText === 'string' ) {
        return comment.shortText.trim();
    }
    return '';
}

/**
 * Find the child reflections (one per `@property`) for a
 * `@typedef {Object} <name>` declared in src/types.js.
 *
 * TypeScript compiles a JSDoc `@typedef {Object} X` with `@property` tags
 * into a type alias whose type is an inline object literal, which TypeDoc
 * represents as a ReflectionType wrapping a declaration with one child per
 * property.
 *
 * @param {import('typedoc').ProjectReflection} project
 * @param {string} typedefName
 * @return {import('typedoc').DeclarationReflection[]}
 */
function getTypedefProperties( project, typedefName ) {
    const reflection = project.getChildByName( typedefName );
    if ( !reflection ) {
        throw new Error( `Could not find a "${typedefName}" declaration via TypeDoc.` );
    }
    if ( reflection.type && reflection.type.declaration && reflection.type.declaration.children ) {
        return reflection.type.declaration.children;
    }
    if ( reflection.children ) {
        return reflection.children;
    }
    throw new Error( `"${typedefName}" was found but doesn't look like an object typedef.` );
}

/**
 * Render human-readable HTML documentation for a single typedef defined in
 * src/types.js, using TypeDoc to parse and resolve the JSDoc.
 *
 * @param {string} typedefName
 * @return {Promise<string>}
 */
async function renderTypedefDocs( typedefName ) {
    // Required lazily so callers that never invoke this function don't pay
    // the cost of loading TypeDoc/TypeScript.
    const { Application, TSConfigReader } = require( 'typedoc' );

    const app = await Application.bootstrap(
        {
            entryPoints: [ path.join( __dirname, 'src', 'types.js' ) ],
            tsconfig: path.join( __dirname, 'tsconfig.json' ),
            skipErrorChecking: true,
            excludeExternals: true
        },
        [ new TSConfigReader() ]
    );

    const project = await app.convert();
    if ( !project ) {
        throw new Error( 'TypeDoc failed to convert src/types.js.' );
    }

    const properties = getTypedefProperties( project, typedefName );
    const rows = properties.map( ( prop ) => `
    <tr>
      <td><code>${escapeHtml( prop.name )}</code></td>
      <td><code>${escapeHtml( prop.type ? prop.type.toString() : 'unknown' )}</code></td>
      <td>${prop.flags && prop.flags.isOptional ? 'optional' : 'required'}</td>
      <td>${escapeHtml( getCommentText( prop ) )}</td>
    </tr>` ).join( '' );

    return `<table class="listing-config-docs">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th></th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>${rows}
  </tbody>
</table>`;
}

module.exports = {
    renderTypedefDocs
};
