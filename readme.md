# Google Book Search Api

## Proje Özeti

Proje Google Books Api kullanarak kitap aramanızı, kullanıcı kaydı ve kullanıcı girişi, kitapları bookmark'a ekleleme/listeleme/silme işlemleri yapmanızı sağlar.

## Kurulum ve Yapılandırma

### Gereksinimler

Projenin çalışabilmesi için;

- `docker`, `docker-compose` ve `git` paketlerinin kurulu olması gerekmektedir.
- `3000` portunun kullanılabilir olması gerekmektedir.(Kullanılabilir olmaması durumunda yapılandırma başlığı altındaki verilen bilgiler dahilinde BOOK_SERVICE_PORT değerini düzenleyeniz.)

### Kurulum

Projeyi klonladıktan sonra docker klasörü içerisine girerek projeyi çalıştırabilirsiniz.

```sh
$ git clone https://github.com/myazarc/gbook gbook
$ cd ./gbook/docker
$ docker-compose up -d
```

Proje çalıştırılmış olacaktır ve `http://localhost:3000` portundan erişilebilir durumdadır.
Docker ile; `mysql`, `redis`, `elasticsearch`, `kibana`, `user-service` ve `book-service` containerleri çalıştırılacaktır. `user-service` ve `book-service` bu işlem sırasında build alınıp çalıştırılacaktır. Dolayısı ile bu işlem biraz uzun sürebilir.

### Yapılandırma

Sistem yapılandırma işlemleri için env file kullanmaktadır.
`docker/.env` ve `envs/.env.development` dosyalarını konfigure etmeniz gereklidir. Varsayılan ayarlar dahilinde sisteminizde `3000` portunun müsait olması durumunda hiçbir bilgiyi değiştirmeden sistemi çalıştırabilirsiniz.

#### .env file

```env
#App
USER_SERVICE_PORT=3001
USER_SERVICE_HOST="userservice"
BOOK_SERVICE_PORT=3000

#Database
DB_HOST="mysql"
DB_USER="user"
DB_PASS="12345"
DB_NAME="gbook"
DB_PORT=3306

#JWT
JWT_SECRET="secret"

#Redis
REDIS_HOST="redis"
REDIS_PORT=6379
REDIS_PASS=""

#Elasticsearch
ELASTICSEARCH_HOST="elasticsearch"
ELASTICSEARCH_PORT=9200
```

#### Açıklamalar

| Parametre Adı      | Açıklama                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| USER_SERVICE_PORT  | user-service mikroservisinin hangi port üzerinde çalışacağını belirler                                                                         |
| USER_SERVICE_HOST  | user-service mikroservisinin hangi adres üzerinde çalışmakta olduğu girilir. Mikroservis arası haberleşme bu adresler üzerinden yapılmaktadır. |
| BOOK_SERVICE_PORT  | book-service mikrservisinin ve genel uygulamanın hangi port üzerinde çalışacağını belirler                                                     |
| DB_HOST            | Veritabanı host bilgisi                                                                                                                        |
| DB_USER            | Veritabanı kullanıcı adı                                                                                                                       |
| DB_PASS            | Veritabanı kullanıcı şifresi                                                                                                                   |
| DB_PORT            | Veritabanı portu                                                                                                                               |
| DB_NAME            | Veritabanı adı                                                                                                                                 |
| JWT_SECRET         | jwt oluşturulurken kullanılan secret anahtarı                                                                                                  |
| REDIS_HOST         | Redis host                                                                                                                                     |
| REDIS_PORT         | Redis port                                                                                                                                     |
| REDIS_PASS         | Redis parolası                                                                                                                                 |
| ELASTICSEARCH_HOST | Elasticsearch Host bilgisi                                                                                                                     |
| ELASTICSEARCH_PORT | Elasticsearch Port bilgisi                                                                                                                     |

## Teknik Detaylar

Proje nodejs üzerine mikroservis mimarisi ile inşa edilip typescript ile yazılmıştır.
Projede http işlemleri için expressjs, verileri saklamak için mysql, orm işlmeleri için sequelize, cache için redis, bookmarka alınan kitaplarda arama gerçekleştirebilrmek için elasticsearch kullanılmıştır.

Projede Veritabanı modelleme yapılırken Code-First olarak hazırlanıp, sequelize orm işlemleri için decoratorler entegre edilmiştir.

book-service ve user-service isimli iki servis bulunmaktadır.
user-service'de login ve register işlemleri bulunmaktadır.
book-service'de kitap arama, bookmarka kitap ekleme, bookmarkı listeleme, bookmarktan kitap çıkarma ve bookmarkta arama yapma servisleri bulunmaktadır.

user-service mikroservisi http-proxy ile book-service mikroservisine bağlıdır.

Projede **Bearer token** ile authorization sağlanmaktadır.

## Projenin Çalışma Yapısı

- Register servisinden kayıt işlemi gerçekleştirilir.
- Login servisinden access-token alınır.
- Search servisi ile google books apiden arama sağlanır. Arama fieldleri: Kitap Adı, kitap yazarı,kitap yayıncısı, isbn ve keywords
- Bookmark Add servisi ile; Search servisinden elde edilen id gönderilerek kullanıcı bazlı bookmarka eklenebilir.
- Bookmark Remove servisi ile eklenen kitap bookmarktan çıkarılabilir.
- Bookmark List servisi ile kullanıcınıza ait tüm bookmarkları görebilirsiniz.
- Bookmark Search ile bookmarkınıza eklediğiniz kitapları elasticsearch üzerinden arama yapabilirsiniz. Arama Fieldleri: title,author,keywords

## Proje Endpoint Bilgileri

| Method   | Url                     | Authorization | Açıklama                                  |
| -------- | ----------------------- | ------------- | ----------------------------------------- |
| `POST`   | /register               | Hayır         | Kayıt olma servisi                        |
| `POST`   | /login                  | Hayır         | Giriş yapma servis                        |
| `GET`    | /search                 | Hayır         | Kitap arama servisi                       |
| `POST`   | /bookmark/:googleBookId | Evet          | Bookmarka kitap ekleme servisi            |
| `DELETE` | /bookmark/:googleBookId | Evet          | Bookmarktan kitap kaldırma servisi        |
| `GET`    | /bookmarks              | Evet          | Bookmarkınızı görüntüleme servisi         |
| `GET`    | /bookmarks/elastic      | Evet          | Bookmarktaki kitaplarınızda arama servisi |

Tüm istekler `json` olarak gönderilmelidir.

### Response Yapısı

Tüm responseler json olarak aşağıdaki standart response üzerinden sağlanmaktadır.

```js
{
  status:boolean,
  data:any,
  error:string | string[],
}
```

### Response Http Durum Kodları

| Http Durum Kodu | Açıklama                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| 500             | İç sunucu hatası,                                                                                                    |
| 409             | (Conflict)Veri girişi yapılmak istenilen değerin zaten var olduğunu belirtir.                                        |
| 404             | (Not Found)Verinin bulunamadığını bildirir.                                                                          |
| 401             | (Unauthorized) Auth işleminin başarısız olduğu veya access_token in gönderilmediği veya süresinin dolduğunu bildirir |
| 400             | (Bad Request) Gönderdiğiniz parametlerin hatalı,eksik veya geçersiz olduğunu bildirir.                               |
| 201             | (Created) Başarıyla verinin kayıt edildiğini bildirir.                                                               |
| 200             | (Ok) İşlemin başarıyla gerçekleştiğini bildirir.                                                                     |

### `POST /register`

Sisteme kayıt olmanız için kullanılır. Veriler doğruysa mysql veritabanına `users` tablosuna kayıt edilir. Aynı eposta adresi ile 2.bir kayıt gerçekleştiremezsiniz.

#### Body Request Parametleri

| Parametre Adı | Açıklama               | Zorunlu mu? |
| ------------- | ---------------------- | ----------- |
| email         | EPosta Adresi          | Evet        |
| password      | Parola, min 8 karakter | Evet        |

#### Response

| Http Durum Kodu | Açıklama                                          | Örnek Cevap                                                                                     |
| --------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 201             | Başarıyla kaydınız oluşturuldu                    | <pre lang="json">{ "status":"true","data":null,"error":null }</pre>                             |
| 400             | Gönderdiğiniz paremetre(ler) geçersiz.            | <pre lang="json">{ "status":"false","data":null,"error":["password must be min 8 char"] }</pre> |
| 409             | Eposta adresiyle daha önce kayıt gerçekleştirildi | <pre lang="json">{ "status":"false","data":null,"error":"EMail already exists" }</pre>          |

### `POST /login`

Sisteme login olmanız için kullanılır. Veriler doğruysa `jsonwebtoken` ile access_token üretilip verilir. Tokenin geçerlilik süresi 1 saattir.

#### Body Request Parametleri

| Parametre Adı | Açıklama               | Zorunlu mu? |
| ------------- | ---------------------- | ----------- |
| email         | EPosta Adresi          | Evet        |
| password      | Parola, min 8 karakter | Evet        |

#### Response

| Http Durum Kodu | Açıklama                                 | Örnek Cevap                                                                                     |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 200             | Başarıyla giriş yapıldı                  | <pre lang="json">{ "status":"true","data":null,"error":null }</pre>                             |
| 400             | Gönderdiğiniz paremetre(ler) geçersiz.   | <pre lang="json">{ "status":"false","data":null,"error":["password must be min 8 char"] }</pre> |
| 401             | Kullanıcı bilgisi bulunamadı veya hatalı | <pre lang="json">{ "status":"false","data":null,"error":null }</pre>                            |

### `GET /search`

Google Book Apiye bağlanarak kitap aramanızı sağlar. Başarılı aramalarınız `redis` üzerinde 30 dakika boyunca saklanır. Aynı aramayı tekrarlamanız durumunda veri doğrudan redis üzerinden getirilir. Arama yaptığınız query stringler ile `md5`lenerek redis keyi oluşturulur ve o şekilde saklanır. Bu servis için `pagination` bulunmaktadır.

#### Query String Request Parametleri

| Parametre Adı | Açıklama                                                                           | Zorunlu mu? |
| ------------- | ---------------------------------------------------------------------------------- | ----------- |
| title         | Kitap Adı                                                                          | Hayır`*`    |
| author        | Kitap Yazarı, min 3 karakter                                                       | Hayır`*`    |
| publisher     | Kitap Yayıncısı, min 3 karakter                                                    | Hayır`*`    |
| subject       | Kitap Konusu, min 3 karakter                                                       | Hayır`*`    |
| isbn          | ISBN, min 3 karakter                                                               | Hayır`*`    |
| keywords      | Kitapla iligli genel arama, min 3 karakter                                         | Hayır`*`    |
| page          | Pagination işlemi için hangi sayfayı almak istiyorsunuz, varsayılan=1              | Hayır       |
| maxResults    | Pagination işlemi için bir sayfada kaç kayıt göstermek istiyorsunuz, varsayılan=20 | Hayır       |

`*` En az bir parametre zorunlu, çoklu olarakta kullanabilirsiniz.

#### Response

| Http Durum Kodu | Açıklama                               | Örnek Cevap                                                                                                             |
| --------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 200             | Arama işlemi sonucu                    | <pre lang="json">{totalItems: 120,maxResults: 4,currentPage: 1,pageCount: 3,items: [{id:...}...],fromRedis: true}</pre> |
| 400             | Gönderdiğiniz paremetre(ler) geçersiz. | <pre lang="json">{ "status":"false","data":null,"error":"Invalid search fields: Avaible fields are: ...." }</pre>       |

### `POST /bookmark/:googleBookId`

Search servisi ile listelediğiniz kitabı bookmarka eklemek için kullanılır. `Authorization` zorunludur. Verdiğiniz google book idyi bu id gerçekten var mı diye kontrol ettikten sonra veritabanına `bookmarks` tablosuna kaydeder ve elasticsearch üzerine aktarımını yapar. Veritabanında ve `elasticsearch` üzerinde; kullanıcı bilgisi,kitap google book idsi, kitap adı, yazar, yayıncı,isbn ve açıklama bilgisini tutar.
Daha önce eklediğiniz bir kitabı tekrardan bookmarka ekleyemezsiniz.

#### Url Params Request Parametleri

| Parametre Adı | Açıklama       | Zorunlu mu? |
| ------------- | -------------- | ----------- |
| googleBookId  | Google Book Id | Evet        |

#### Response

| Http Durum Kodu | Açıklama                                                  | Örnek Cevap                                                                               |
| --------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 201             | Başarıyla kitap bookmarka eklendi                         | <pre lang="json">{ "status":"true","data":{id:...,...},"error":null }</pre>               |
| 409             | Bu kitabı daha önce bookmarka eklenmiş.                   | <pre lang="json">{ "status":"false","data":null,"error":"Bookmark already exists" }</pre> |
| 404             | Girdiğiniz Google Book Id geçersiz veya böyle bir id yok. | <pre lang="json">{ "status":"false","data":null,"error":"Book id not found" }</pre>       |
| 401             | Token bulunamadı veya hatalı/süresi dolmuş                | <pre lang="json">{ "status":"false","data":null,"error":null }</pre>                      |
|                 |

### `DELETE /bookmark/:googleBookId`

Add Bookmark servisi ile bookmarka eklediğiniz kitabı kaldırmak için kullanılır. `Authorization` zorunludur. Verdiğiniz google book idyi bu id gerçekten var mı diye kontrol ettikten sonra veritabanına `bookmarks` tablosundan ve `elasticsearch` üzerinden kaldırır.

#### Url Params Request Parametleri

| Parametre Adı | Açıklama       | Zorunlu mu? |
| ------------- | -------------- | ----------- |
| googleBookId  | Google Book Id | Evet        |

#### Response

| Http Durum Kodu | Açıklama                                                                | Örnek Cevap                                                                          |
| --------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 200             | Başarıyla kitap bookmarktan kaldırıldı                                  | <pre lang="json">{ "status":"true","data":{id:...,...},"error":null }</pre>          |
| 404             | Girdiğiniz Google Book Id ile daha önce bookmarka eklediğiniz kitap yok | <pre lang="json">{ "status":"false","data":null,"error":"Bookmark not found" }</pre> |
| 401             | Token bulunamadı veya hatalı/süresi dolmuş                              | <pre lang="json">{ "status":"false","data":null,"error":null }</pre>                 |
|                 |

### `GET /bookmarks`

Daha önce bookmark servisine eklemiş olduğunuz bookmarkları listemek için kullanılır. `Authorization` zorunludur. Bu servis için `pagination` bulunmaktadır. Bu servis sadece `veritabanı` üzerinden sorgulama yapar.

#### Query String Request Parametleri

| Parametre Adı | Açıklama                                                                           | Zorunlu mu? |
| ------------- | ---------------------------------------------------------------------------------- | ----------- |
| page          | Pagination işlemi için hangi sayfayı almak istiyorsunuz, varsayılan=1              | Hayır       |
| maxResults    | Pagination işlemi için bir sayfada kaç kayıt göstermek istiyorsunuz, varsayılan=20 | Hayır       |

#### Response

| Http Durum Kodu | Açıklama                               | Örnek Cevap                                                                                                                                               |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200             | Arama işlemi sonucu                    | <pre lang="json">{"status":true,error:null,"data":{totalItems: 120,maxResults: 4,currentPage: 1,pageCount: 3,items: [{id:...}...],fromRedis: true}}</pre> |
| 400             | Gönderdiğiniz paremetre(ler) geçersiz. | <pre lang="json">{ "status":"false","data":null,"error":["maxResults must be max 40"] }</pre>                                                             |

### `GET /bookmarks/elastic`

Daha önce bookmark servisine eklemiş olduğunuz bookmarkları listemek için kullanılır. `Authorization` zorunludur. Bu servis sadece `elasticsearch` üzerinden sorgulama yapar.

#### Query String Request Parametleri

| Parametre Adı | Açıklama                                   | Zorunlu mu? |
| ------------- | ------------------------------------------ | ----------- |
| title         | Kitap Adı                                  | Hayır`*`    |
| author        | Kitap Yazarı, min 3 karakter               | Hayır`*`    |
| keywords      | Kitapla iligli genel arama, min 3 karakter | Hayır`*`    |

`*` En az bir parametre zorunlu, çoklu olarakta kullanabilirsiniz.

#### Response

| Http Durum Kodu | Açıklama                               | Örnek Cevap                                                                                                      |
| --------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 200             | Arama işlemi sonucu                    | <pre lang="json">{ "status":"true","data":[{...}],"error":null }</pre>                                           |
| 400             | Gönderdiğiniz paremetre(ler) geçersiz. | <pre lang="json">{ "status":"false","data":null,"error":"Invalid search fields: Avaible fields are: ..." }</pre> |

## Proje Dizin Yapısı

### Genel Yapı

```
.
├── docker                  # Docker konfigrasyon dosya ve dizinleri
├── envs                    # Proje konfigrasyon dosyaları
└── *-service               # Microservis modulleri (Bknz: Mikroservis Yapısı)
```

### Microservis Yapısı

```
.
├── ...
├── *-service              # Mikroservis modülü
│   ├── __tests__          # Jest ile yazılmış integration testleri
│   ├── Dockerfile         # Dockerize edilmesi için gerekli ayarlar dosyası
│   └── src                # Proje kaynak dosyaları
│        ├── controllers   # Request validasyonlarını yapıp istek ve sonuçları routera iletimi
│        ├── database      # Veritabanı ayarları, modeller ve repositoriler
│        ├── dto           # Gelen ve giden veri şablonlaro
│        ├── middlewares   # Express için middlewares
│        ├── routes        # Conrollerın route işlemlerine aktarılması
│        ├── services      # Harici servislere erişim veya veritabanı işlemlerini gerçekleştir
│        ├── utils         # Yardımcı kütüphaneler
│        ├── app.ts        # Express çalışma ayarları ile ilgili dosya
│        └── index.ts      # Veritabanı başlatma ve express sunucyu ayağa kaldırma ile ilgli dosya
└── ...

```
