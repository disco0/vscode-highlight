declare type ConfigurationSchema = import('vscode-contribution-schema').ConfigurationSchema
import type { Extension } from 'vscode'

declare interface ExtensionConfiguration
{
    contributes:
    {
        configuration: ConfigurationSchema;
    }
}
