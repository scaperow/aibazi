# AIBazi

根据用户姓别、生日、性别、等信息，为用户提供相关的八字信息。预留了 AI 调用能力，可以扩展出其他强大的功能（例如：解析，测命）

借助 Taro 框架，支持多端，包括：  
* 抖音小程序
* h5
* 微信小程序
...

# Stack

- Vue
- Taro
- TypeScript
- TailwindCSS
- Pinia

## Environment Configuration

The application requires the following environment variables to be configured:

- `TARO_APP_TT_CLOUD_ENV_ID`: Cloud environment identifier
- `TARO_APP_TT_CLOUD_SERVICE_ID`: Cloud service identifier
- `TARO_APP_API_URL`: Backend API endpoint
- `TARO_APP_TT_BOAT_NAME`: Chat bot name identifier
- `TARO_APP_TT_BOAT_URL`: Chat bot API endpoint

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure the environment variables
3. Install dependencies:

```bash
yarn
```

4. Run the application:
   for platform h5:

```bash
yarn dev:h5
```

for platform weapp:

```bash
yarn dev:weapp
```

for platform tiktok:

```bash
yarn dev:tt
```

> check the `package.json` for other platforms
