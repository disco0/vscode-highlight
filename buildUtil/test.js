const c = require('chalk')
const schema = /** @type {ExtensionConfiguration} */ (require('../src/schema.json'))

let indent = (() => {
    let indentLevel = 0
    let incAmount   = 2;
    const indenterFn = function(...msg){ return `${' '.repeat(indentLevel)}${msg.join(' ')}`}
    const indent = function(inc = incAmount){ indentLevel += inc };
    const dedent = function(inc = incAmount){ indentLevel -= inc };
    return Object.assign(indenterFn, {indent, dedent});;
})()

function log(...msg){ console.log(indent(...msg)) }

const config = schema.contributes.configuration
const configCast = /** @type {ConfigurationSchema} */ (schema.contributes.configuration)
configCast
log(`Keys: `)
indent.indent();
for(const schemaKey of [...Object.keys(/** @type {ConfigurationSchema} */schema.contributes.configuration)])
{
  schema.contributes.configuration[schemaKey]
  log(c.blue(schemaKey));
}
