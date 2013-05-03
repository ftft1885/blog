title:RestAPI入门设计
tag:rest
date:2013/1/18

GET /devide

>GET /device/dev1

>GET /decvice/dev2

GET /service

>GET /service/ftp

>>GET /service/ftp/pool1

>>PUT /service/ftp/pool1

>>GET /service/ftp/pool2

>GET /service/http

>>GET /service/http/pool3

>>POST /service/http/pool9

>>GET /service/http/pool4

>GET /service/email

1. 有父子关系的就是path层级关系。
2. 其他都是并列关系

