const addClickListener = (contentId, name) => `
        document.querySelector('#${contentId} #${name.replace('\.', '\\\\\.')}').addEventListener('click', () => {
          const tableNode = document.querySelector('#${contentId} #${name.replace('\.', '\\\\\.')}-table')
          if(tableNode.getAttribute('style')){
            tableNode.setAttribute('style', '')
          } else {
            tableNode.setAttribute('style', 'display: none')
          }
        })`

const getTotalByList = (testList) => {
  let total = 0
  testList.map(t => {
    if(t.testResults){
      total += t.testResults.length
    } else {
      t.suites.map(suite => total += suite.tests.length)
    }
  })
  return total
}

const getTotal = report => {
  let totalMap: any = {}
  let total = 0
  Object.entries(report).map(([name, testList]) => {
    totalMap[name] = getTotalByList(testList)
    total += totalMap[name]
  })
  return {
    ...totalMap,
    total
  }
}

export const generateHtml = ({ nodeReport, e2eReport }) => {
  const nodeReportTotal = getTotal(nodeReport)
  const e2eReportTotal = getTotal(e2eReport)

  return `<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #root{
        color: #000000d9;
      }
      table {
        border-top: 1px solid #f0f0f0;
        border-left: 1px solid #f0f0f0;
        border-collapse: collapse;
        margin: 0 auto;
      }
      td {
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        padding: 10px 10px;
      }
      #node-report {
        margin-bottom: 10px;
      }
      h3,#node-report,#e2e-report {
        text-align: center;
        font-weight: 500;
      }
      
    </style>
  </head>
  <body>
    <script>
      window.onload = () => {
        ${Object.keys(nodeReport).map(name => addClickListener('node-report', name)).join('')}
        ${Object.keys(e2eReport).map(name => addClickListener('e2e-report', name)).join('')}
      }
    </script>
    <div id='root'>
      <h3>Node 测试报告 (${nodeReportTotal.total})</h3>
      <div id='node-report'>
        ${Object.entries(nodeReport).map(([name, testList]) => `<ul id=${name}>
          ${name} (${nodeReportTotal[name]})
        </ul>
        <table id='${name}-table' style='display: none' border='1' cellspacing='0'>
          ${(testList as any).map(test => (test.testResults).map(res => 
          `<tr>
            <td>${res.fullName}</td>
            <td>${test.file ?? test.testFilePath.replace(/(.+)zstack-ui-server/, '.')}</td>
          </tr>`
          ).join('')
          ).join('')}
        </table>`).join('')}
      </div>
      <h3>e2e 测试报告 (${e2eReportTotal.total})</h3>
      <div id='e2e-report'>
        ${Object.entries(e2eReport).map(([name, testList]) => `<ul id=${name}>
          ${name} (${e2eReportTotal[name]})
        </ul>
        <table id='${name}-table' style='display: none' border='1' cellspacing='0'>
          ${(testList as any).map(test => (test.suites).map(suite => suite.tests.map(res => 
          `<tr>
            <td>${res.fullTitle}</td>
            <td>${test.file}</td>
          </tr>`
          ).join('')
          ).join('')
          ).join('')
          }
        </table>`
        ).join('')}
      </div>
    </div>
  </body>
</html>`
}