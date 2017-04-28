# For backend-taiji

同一个项目可启动多个进程.

## 开发环境

### 环境变量
```
NODE_ENV="development",CLIENT_PROVIDER＝"http://dev-backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://dev-backend.wosai.cn -c
```

*port: 端口号*

## 测试环境
### 环境变量
```
NODE_ENV="test",CLIENT_PROVIDER＝"http://test-backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://test-backend.wosai.cn -c
```

## 生产环境
### 环境变量
```
NODE_ENV="production",CLIENT_PROVIDER＝"http://backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://backend.wosai.cn -c
```

# For backend-upay

## 开发环境

### 环境变量
```
NODE_ENV="development",CLIENT_PROVIDER＝"http://backend.dev.shouqianba.com/rpc/channel",CLIENT_TYPE="shouqianba"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://backend.dev.shouqianba.com -c
```

*port: 端口号*

## 测试环境
### 环境变量
```
NODE_ENV="test",CLIENT_PROVIDER＝"http://backend.test.shouqianba.com/rpc/channel",CLIENT_TYPE="shouqianba"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://backend.test.shouqianba.com -c
```

## 生产环境
### 环境变量
```
NODE_ENV="production",CLIENT_PROVIDER＝"http://backend.shouqianba.com/rpc/channel",CLIENT_TYPE="shouqianba"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://backend.shouqianba.com -c
```


# For score-service

## 开发环境

### 环境变量
```
NODE_ENV="development",CLIENT_TYPE="scoreService"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://dev.wosai.cn:3433 -c
```

*port: 端口号*


# For mobile

同一个项目可启动多个进程.

## 开发环境

### 环境变量
```
NODE_ENV="development",CLIENT_PROVIDER＝"http://dev-backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://mobile-api.dev.wosai.cn -c
```

*port: 端口号*

## 测试环境
### 环境变量
```
NODE_ENV="test",CLIENT_PROVIDER＝"http://test-backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://mobile-api.test.wosai.cn -c
```

## 生产环境
### 环境变量
```
NODE_ENV="production",CLIENT_PROVIDER＝"http://backend.wosai.cn/taiji/rpc/store"
```
### 启动命令
```
node path/to/auth-server/bin/www -p port -t http://mobile-api.wosai.cn -c
```
