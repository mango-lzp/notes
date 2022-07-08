import fetch from 'node-fetch'
import {
  writeFileSync
} from 'fs'
import { resolve } from 'path'

// const base = 'http://172.20.14.248:3201'
// const [version, oemType] = 'master&zstack'.split('&')
// const lang = 'zh-CN'

// fetch(`${base}/api/doc-zip?version=${version}&oemType=${oemType}`)
// .then(res => res.json())
// .then(result => {
//   const docZip = result?.list?.[0]
//   const langMap = {
//     'zh-CN': 'zhCnFileUuid',
//     'en-US': 'enUsFileUuid'
//   }
//   const fileUuid = docZip?.[langMap[lang]]
//   const fileName = `${fileUuid}.zip`
//   console.log(fileName)
// })

fetch('http://ui.zstack.io:3200/api/oem?keyword=nologo')
.then(async res => {
  let result = await res.json()
  const oem = result.list[0]
  const obj = JSON.parse(oem['en-US'])

  const {
    themeMode,
    themeColor,
    browserTitle,
    loginTitle,
    bannerTitle,
    bannerFontSize,
    overviewTitle,
    overviewMode,
    overviewMonitorType,
    versonName,
    versonNumber,
    email,
    helpDocument,
    copyRight
  } = obj

  const config = {
    oem: true,
    themeMode,
    themeColor,
    browserTitle,
    loginTitle,
    bannerTitle,
    bannerFontSize,
    overviewTitle,
    overviewMode,
    overviewMonitorType,
    versonName,
    versonNumber,
    email,
    copyRight,
    helpDocument
  }



  // console.log(r)
  writeFileSync(
    resolve('./src/data.json'),
    JSON.stringify(config, null, 2),
    'utf-8'
  )
  // return r
})
