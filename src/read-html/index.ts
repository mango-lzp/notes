import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { Client } from 'ssh2'
import { generateHtml } from './generate-html'

const fs = require('fs')
const path = require('path')

const e2eReportUrl = 'http://172.20.15.48:9000/job/e2e/HTML_20Report/index.html'
const nodeReportUrl = 'http://172.20.15.48:9000/job/node/NodeApiTest_20Report/result_lastest.html'

export async function asyncPool<T>(
  poolLimit: number,
  array: T[],
  iteratorFn: (item: T, array: T[]) => PromiseLike<any>
) {
  const ret = []
  const executing = []
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

const getTestResult = async (url) => {
  return fetch(url)
    .then(async (response: Response) => await response.text())
    .then(htmlText => {
      const $ = cheerio.load(htmlText)
  
      const nodeData = $('#resData').text() // node 和 util 测试数据存储在这里
      const e2eData = $('body').data('raw') // e2e 和 zsha2 测试数据存储在这里
  
      const parse = str => JSON.parse(JSON.parse(str))
      const stringify = str => JSON.stringify(str, null, 2)
  
      const testResultJson = nodeData ? parse(nodeData) : e2eData
  
      return testResultJson
    });
}

const getAuthByPath = async (path, {
  projectPath = '/home/mango/workspace/zstack-ui-server',
  host = '172.20.14.248',
  password = 'password',
  username = 'root'
}: {
  projectPath?: string
  host?: string
  password?: string
  username?: string
} = {}) => {
  const client = new Client()

  return new Promise<string>((resolve) => {
    client
      .on('ready', () => {
        client.exec(`cd ${projectPath} && git log -1 --pretty="%cn" ${path}`, (err, channel) => {
          let res = ''
          channel
            .on('data', data => res += data)
            .on('close', () => {
              client.end()
              resolve(res.replace('\n', ''))
            })
        })
      })
      .connect({
        host,
        password,
        username
      })
  })
}

const analyseNode = async () => {
  const result = await getTestResult(nodeReportUrl)
  const failedList = result?.testResults
    ?.filter(test => test?.testResults?.some(t => t.status === 'failed'))
    ?.map(test => {
      test.testResults = test?.testResults?.filter(t => t.status === 'failed')
      return test
    })

  let authMap: any = {}
  await asyncPool<any>(5, failedList, async test => {
    const path = test.testFilePath.replace(/(.+)zstack-ui-server/, '.')
    const auth = await getAuthByPath(path)
    authMap[auth] ? authMap[auth].push(test) : authMap[auth] = [test]
  })
  console.log(authMap)
  return authMap
}

const analyseE2e = async () => {
  const result = await getTestResult(e2eReportUrl)
  const failedList = result.results
    ?.filter(r => r.suites?.some(s => s.tests?.some(t => t.fail) || s.suites.some(_s => _s.tests?.some(t => t.fail)) ))
    ?.map(r => {
      r.suites = r.suites.map(s => {
        s.tests = s.tests?.filter(t => t.fail)
        s.suites.map(_s => {
          s.tests.push(...(_s.tests?.filter(t => t.fail) ?? []))
        })
        return s
      })
      return r
    })

  let authMap: any = {}
  await asyncPool<any>(5, failedList, async test => {
    const path = test.file
    const auth = await getAuthByPath(path, {
      projectPath: '/home/mango/workspace/zstack-ui-e2e',
      host: '127.0.0.1'
    })
    authMap[auth] ? authMap[auth].push(test) : authMap[auth] = [test]
  })
  console.log(authMap)
  return authMap
}
// analyseE2e()

(async () => {
  const nodeReport = await analyseNode()
  const e2eReport = await analyseE2e()
  const htmlText = generateHtml({ nodeReport, e2eReport })
  console.log(htmlText)
  
  fs.writeFileSync(
    path.resolve(__dirname, 'index.html'),
    htmlText
  )
})()