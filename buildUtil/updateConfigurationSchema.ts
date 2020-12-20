/**
 * Extension configuration schema loader script. Reads generated contributions json
 * fragment, and updates configuration property in contributes key in package.json after
 * creating a backup in os' temp directory.
 */

//#region Imports

import fs   = require('fs');
import path = require('path');
import os   = require('os');

import { ConfigurationSchema } from 'vscode-contribution-schema';

//#endregion Imports

//#region Configuration

const basePath = path.resolve(__dirname, '../');
const packageJsonPath = path.resolve(basePath, 'package.json');
const newSchemaPath = path.resolve(basePath, 'src/schema.json');

// const newSchema: ConfigurationSchema = require('../src/schema.json')

//#endregion Configuration

updateSchema()

//#region Implementation

function updateSchema(schemaPath: string = newSchemaPath, packagePath: string = packageJsonPath)
{
    //#region Validate paths

    if(!(fs.existsSync(packagePath)))
    {
        console.error(`Extension package.json not found at path: ${packagePath}.`)
        return
    }

    if(!(fs.existsSync(schemaPath)))
    {
        console.error(`Reference schema data file not found at path: ${schemaPath}.`)
        return
    }

    //#endregion Validate paths

    //#region Import and backup current package data

    console.log(`Importing package.json data from ${packagePath}`)

    const pkg = require(packagePath) as NpmPackageFile;

    const backupPackageJSONPath = path.resolve(os.tmpdir(), `package.json`)

    console.log(`Backing up existing package.json data to ${backupPackageJSONPath}`)

    fs.writeFileSync( backupPackageJSONPath, JSON.stringify(pkg, null, 4), 'utf-8' )

    //#endregion Import and backup current package data

    //#region Import and validate new configuration schema

    // @TODO(disk0): Interface directly with schema build here

    // Having to get configuration object through a couple properties is due to
    // how schema builder generates schema—needing to jump through a couple hoops
    // might be good as an idiot check before writing the wrong thing in the wrong place
    // on accident

    const configSchema = (require(schemaPath)?.contributes?.configuration ?? undefined) as ConfigurationSchema | undefined

    if(!configSchema)
    {
        throw new Error(
          `Configuration property does not exist in schema data file.\n  Loaded JSON:\n${
              JSON.stringify(configSchema, null, 4)
          }`);
    }

    //#endregion Import and validate new configuration schema

    //#region Update contributes.configuration value

    // This feels too easy, if this doesn't work check here
    const newPackageJsonData =
    {
      ...pkg,
      contributes:
      {
          ...pkg.contributes,
          configuration: configSchema
      }
    } as NpmPackageFile

    //#endregion Update contributes.configuration value

    console.log(`Writing updated package.json to ${packagePath}`)

    fs.writeFileSync(packagePath, JSON.stringify(newPackageJsonData, null, 4), 'utf-8' )
}

//#endregion Implementation

//#region Types

// Just reflect shape directly instead of interface
type NpmPackageFile = typeof import('../package.json')

//#endregion Types
