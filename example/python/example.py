# example.py
import hashlib, base64

clientId = '05a6c7f6981a4de3882c064c68e5723d'
clientSecret = '03f3e38fe70443efa0c9bac96266634a'

content = '{"id":0,"jsonrpc":"2.0","method":"createVoucherDef","params":[{"deviceId":"4575426b-e1e5-4372-a5fe-f25d2959aae4","page":1,"pageSize":10,"storeId":"54e8b5e5-b53f-4fc5-9a99-361591ce29cc"},{"effectiveDate":1446788002506,"faceValue":24600,"name":"test","status":"Normal","storeId":"54e8b5e5-b53f-4fc5-9a99-361591ce29cc"}]}'
m = hashlib.md5()
m.update(content + clientSecret)
sign = m.hexdigest()
print sign

basic = base64.b64encode(clientId + ':' + sign)
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + basic
}

print headers
