package cn.wosai;

import sun.misc.BASE64Encoder;

import java.security.MessageDigest;

/**
 * Created by xuyuanxiang on 15/11/2.
 */
public class example {


    public static String MD5(String s) {
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        try {
            byte[] btInput = s.getBytes("utf8");
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str).toLowerCase();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    public static void main(String[] args) throws Exception {
        String clientId = "05a6c7f6981a4de3882c064c68e5723d";
        String clientSecret = "03f3e38fe70443efa0c9bac96266634a";

        String content = "{\"id\":0,\"jsonrpc\":\"2.0\",\"method\":\"createVoucherDef\",\"params\":[{\"deviceId\":\"4575426b-e1e5-4372-a5fe-f25d2959aae4\",\"page\":1,\"pageSize\":10,\"storeId\":\"54e8b5e5-b53f-4fc5-9a99-361591ce29cc\"},{\"effectiveDate\":1446788002506,\"faceValue\":24600,\"name\":\"test\",\"status\":\"Normal\",\"storeId\":\"54e8b5e5-b53f-4fc5-9a99-361591ce29cc\"}]}";

        // 生成签名
        String sign = MD5(content + clientSecret);
        System.out.println(sign);

        String basic = new BASE64Encoder().encode((clientId + ":" + sign).getBytes("utf-8"));
        System.out.println(basic.replace("\n", ""));

    }
}

