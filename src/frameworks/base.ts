import { LanguageId } from '../utils'
import { DirStructure, OptionalFeatures, RewriteKeySource, RewriteKeyContext, DataProcessContext } from '../core/types'
import { ParserExtRegEx } from '../meta'

export type FrameworkDetectionDefine = string[] | { none?: string[]; every?: string[]; any?: string[] } | ((packages: string[], root: string) => boolean)

export type PackageFileType
= 'packageJSON'
| 'pubspecYAML'
| 'composerJSON'
| 'gemfile'
| 'none'

export abstract class Framework {
  abstract id: string
  abstract display: string
  monopoly?: boolean

  /**
   * Packages names determine whether a frameworks should enable or not
   */
  abstract detection: Partial<Record<PackageFileType, FrameworkDetectionDefine>>

  /**
   * Language Ids to enables annotations
   */
  abstract languageIds: LanguageId[]

  /**
   * Array of regex for detect keys in document
   */
  abstract keyMatchReg: RegExp | RegExp[] | ((languageId?: string, filepath?: string) => RegExp| RegExp[])

  /**
   * Return possible choices of replacement for messages extracted from code
   */
  abstract refactorTemplates (keypath: string, languageId?: string, content?: string): string[]

  /**
   * Locale file's name match
   */
  filenameMatchReg (dirStructure?: DirStructure): RegExp | string {
    if (dirStructure === 'file')
      return `^([\\w-_]*)\\.(${ParserExtRegEx})$`
    else
      return `^(.*)\\.(${ParserExtRegEx})$`
  }

  enableFeatures?: OptionalFeatures

  getKeyMatchReg (languageId = '*', filepath?: string): RegExp[] {
    let reg: RegExp | RegExp[] | undefined
    if (typeof this.keyMatchReg === 'function')
      reg = this.keyMatchReg(languageId, filepath)
    else
      reg = this.keyMatchReg

    if (!Array.isArray(reg))
      reg = [reg]

    return reg
  }

  rewriteKeys (key: string, source: RewriteKeySource, context: RewriteKeyContext = {}) {
    return key
  }

  preprocessData (data: object, context: DataProcessContext): object {
    return data
  }

  deprocessData (data: object, context: DataProcessContext): object {
    return data
  }
}
