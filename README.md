# cic-tool-kit

##  安装
```
npm install -g @cic-digital/cic-tool-kit
```

##  检查最新的GOT 并列出下载url
```
ctk checkgot
```

##  编辑postman导出的json文件
postman的请求中如果有上传文件的部分，在导出的json文件里会丢失,为了能够正常执行，请把文件名写到DESCRIPTION栏，导出json文件后通过下面命令进行转换
```
ctk editpostman --input=inputfile.json --output=outputfile.json
```

##  下载最新的工资单
首先你得在ibm内网，能访问workday,第一次使用可能会需要email验证
```
ctk payslip -u yourIntranetId -p yourPassword
```

##  比较图片
```
ctk comparePic -a 图片1 -b 图片2 -o 比较结果图片
```

## 自动输入密码
先保存好你的密码
```
ctk updateparam -k pass -d {yourpassword}
```

需要输的时候
```
ctk type -k pass
```

列出保存好的密码
```
ctk listparam
```