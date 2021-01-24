/**
 * Extension configuration schema loader script. Reads generated contributions json
 * fragment, and updates configuration property in contributes key in package.json after
 * creating a backup in os' temp directory.
 */

//#region Imports

import fs   = require('fs');
import path = require('path');
import os   = require('os');

import {
  ConfigurationSettingSchema,
  ConfigurationSchema
} from 'vscode-contribution-schema';
import { OverwriteProps } from 'tsdef'

import { configurationSchema } from './schema/config'

//#endregion Imports

//#region Configuration

const basePath = path.resolve(__dirname, '../');
const packageJsonPath = path.resolve(basePath, 'package.json');
const newSchemaPath = path.resolve(basePath, 'src/schema.json');

//#endregion Configuration

updateSchema(configurationSchema)

//#region Implementation

function updateSchema(schemaPath?: string, packagePath?: string);
function updateSchema(schemaPath?: ConfigurationSchema, packagePath?: string);
function updateSchema(schemaPath: ConfigurationSchema | string = newSchemaPath, packagePath: string = packageJsonPath)
{
    //#region Validate paths

    if(!(fs.existsSync(packagePath)))
    {
        console.error(`Extension package.json not found at path: ${packagePath}.`)
        return
    }

    if(typeof schemaPath === 'string' && !(fs.existsSync(schemaPath)))
    {
        console.error(`Reference schema data file not found at path: ${schemaPath}.`)
        return
    }

    //#endregion Validate paths

    //#region Import and backup current package data

    console.log(`Importing package.json data from ${packagePath}`)
    const pkg = require(packagePath) as ExtensionPackageJSON;

    const backupPackageJSONPath =
        path.resolve( os.tmpdir(),
                      `${(({name}) => name ? (name + "-") : "" )(pkg)}package.json`);

    console.log(`Backing up existing package.json data to ${backupPackageJSONPath}`)
    fs.writeFileSync( backupPackageJSONPath, JSON.stringify(pkg, null, 4), 'utf-8' )

    //#endregion Import and backup current package data

    //#region Import and validate new configuration schema

    let configSchema: ConfigurationSchema | undefined;

    //#region Configuration From Argument

    if(typeof schemaPath === 'object')
    {
        configSchema = schemaPath
    }

    //#endregion Configuration From Argument

    else

    //#region Configuration Path From Argument

    {
      // Having to get configuration object through a couple properties is due to
      // how schema builder generates schema—needing to jump through a couple hoops
      // might be good as an idiot check before writing the wrong thing in the wrong place
      // on accident.

        configSchema = (require(schemaPath)?.contributes?.configuration ?? undefined)

        if(!configSchema)
            throw new Error(
                `Configuration property does not exist in schema data file.\n  Loaded JSON:\n${
                JSON.stringify(configSchema, null, 4)
            }`);
    }

    //#endregion Configuration Path From Argument

    //#endregion Import and validate new configuration schema

    //#region Update contributes.configuration value

    const newPackageJsonData: ExtensionPackageJSON =
    {
        ...pkg,
        contributes:
        {
            ...pkg.contributes,
            configuration: configSchema
        }
    }

    //#endregion Update contributes.configuration value

    console.log(`Writing updated package.json to ${packagePath}`)

    fs.writeFileSync(packagePath, JSON.stringify(newPackageJsonData, null, 4), 'utf-8' )
}

//#endregion Implementation

//#region Types

// Just reflect shape directly instead of interface
type ExtensionPackageJSON = OverwriteProps<
    typeof import('../package.json'),
    { contributes: { configuration: ConfigurationSchema } }
    // Record<'contributes', Record<'configuration', ConfigurationSchema>>
>

//#endregion Types
