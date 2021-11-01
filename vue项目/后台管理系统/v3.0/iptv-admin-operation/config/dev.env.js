/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-14 18:58:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-29 17:04:37
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  Mock: true
})
