import { glob } from 'glob'
import * as actionType from '../actionType/index.mjs'
import { config } from '../config/index.mjs'
import { type } from '../generator/types/type/index.mjs'
import * as helper from '../helper/index.mjs'

const { templatePath } = config

export default async function (/** @type {import('plop').NodePlopAPI} */ plop) {
  const hbsFiles = await glob(`${templatePath}/**/*.hbs`, { absolute: true })
  const ctx = { hbsFiles, templatePath, plop }

  for (const key of Object.keys(actionType)) {
    plop.setActionType(key, actionType[key])
  }

  for (const key of Object.keys(helper)) {
    plop.setHelper(key, helper[key])
  }

  plop.setGenerator('type', type(ctx))
}
