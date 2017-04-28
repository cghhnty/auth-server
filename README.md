# Auth Server

一个基于 Node 权限校验代理服务器。

## 文档

### [1.客户端校验签名算法](./docs/signature.md)

#### [1.1 Java example](./example/java/src/main/java/cn/wosai/ReqeustDemo.java)

#### [1.2 Javascript example](./example/javascript/example.js)

#### [1.3 Python example](./example/python/example.py)

### [2.部署](./docs/deploy.md)

## 文件组织

```
auth-server/ 
├── package.json
├── node_modules/
├── docs/------------------------------------文档
├── components/------------------------------公共组件
│   ├── errors/---------------------------------错误模块
│   ├── logger/---------------------------------日志
│   └── redis/----------------------------------Redis客户端
├── example/---------------------------------公共组件
│   ├── python/---------------------------------Python签名示例
│   ├── java/-----------------------------------Java签名示例
│   └── javascript/-----------------------------JavaScript签名示例
├── config／---------------------------------不同环境下的配置参数
├── model/-----------------------------------Model模块
│   └── client/---------------------------------客户端
│        ├── index.js------------------------------客户端查询
│        ├── saas.js-------------------------------saas客户端查询接口实现
│        └── shouqianba.js-------------------------收钱吧客户端查询接口实现
├── test/------------------------------------测试
├── tool/------------------------------------工具
│   └── sign.js---------------------------------签名工具
├── bin/------------------------------------测试
│   └── www.js------------------------------启动文件
└── proxy.js---------------------------------代理服务器
```

## 环境变量

+ `NODE_ENV`: 可选：`development`、 `test`、`production`。 缺省：`production`。
+ `CLIENT_TTL`: client在redis中有效期, 单位：秒。缺省: `3600`。
+ `CLIENT_PROVIDER`（必须）: 查询client的backend, e.g. https://test-backend.wosai.cn/taiji/rpc/store
+ `CLIENT_TYPE`: 可选`sass`、`shouqianba`。 缺省:`sass`。 

## 启动

```
node bin/www
```

```
Usage: www [options]
    
Options:
    -h, --help          output usage information
    -V, --version       output the version number
    -p, --port <n>      Deploy port. e.g. 8080
    -c, --cluster       Start worker processes.
    -t, --target [url]  Proxy pass target. e.g. http://dev.wosai.cn or http://dev.wosai.cn:9977 or http://dev.wosai.cn:9977/sub
```

e.g. 

```
node auth-server/bin/www -p 8080 -t http://dev.wosai.cn:9977
```
