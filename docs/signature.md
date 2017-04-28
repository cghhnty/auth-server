# 客户端校验签名算法

## 设备（调用端）初始化

获取clientId和clientSecret，具体初始化过程及方法详见其他文档

```
// 为每个调用端分配的唯一标识：
var clientId = "id";
// 为每个调用端分配的密钥：
var clientSecret = "secret";
```

## 设备调用API

### 1. 处理参数
```
// 请求参数
var parameters = {
  "method":"saveOrderProductDetails",
  "params":
   [  {"storeId":"montreal"},
      { "orderCode":"F1",
        "totalPrice":91900,
         "items":[{
             "itemName":"电炖锅",
             "itemPrice":900
             },
             {"itemName":"国开行卡",
             "itemPrice":9100
             }]
      }
   ],
  "jsonrpc": "2.0",
  "id": 0
};


// 序列化JSON后得到待签名内容：
var content = JSON.stringify(parameters); 

```
序列化后的content:
```
{"method":"saveOrderProductDetails","params":[{"storeId":"montreal"},{"orderCode":"F1","totalPrice":91900,"items":[{"itemName":"电炖锅","itemPrice":900},{"itemName":"国开行卡","itemPrice":9100}]}],"jsonrpc":"2.0","id":0}
```

*注意:* `GET`的请求, `content`为空即可。

### 2. 生成签名
```
var sign = MD5(content + clientSecret).toHex();
```

*注意:* `GET`的请求, `content`为空，签名实际上是：MD5(clientSecret).toHex()。

### 3. 构建请求

#### 请求首部

##### Content-Type
支持`application/json`和`application/x-www-form-urlencoded`； 字符集可不传，**缺省**：`utf8`。
```
request.setHeader('Content-Type' : 'application/json; charset=utf8'); 
```

#####  Authorization

用`:`连接**clientId**和**sign**，转为**base64**字符串：
```
var basic = encodeBase64String(clientId + ":" + sign);
```
按如下方式，放到`Authorization`首部中：
```
request.setHeader('Authorization', 'Basic ' + basic);
```

### 4. 发起请求

**注意：**此处请求写入的content，必须与签名时的content保持一致：
```
request.open(url);
request.write(content);
request.send();
```

## 约定错误返回

### 却少`Authorization`

服务器返回`401`状态码：
```
header:
	HTTP/1.1 401
	Content-Type: text/plain; charset=UTF-8
body
	Unauthorized.
```


### 却少`Content-Type`

却少或不为指定`application/json`和`application/x-www-form-urlencoded`类型，

服务器返回`415`状态码：

```
header:
	HTTP/1.1 415
	Content-Type: text/plain; charset=UTF-8
body
	Unsupported media type.
```

### clientId不存在或签名校验失败
服务器返回`403`状态码：

```
header:
	HTTP/1.1 403
	Content-Type: text/plain; charset=UTF-8
body
	Forbidden.
```
