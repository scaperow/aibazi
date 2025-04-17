import Taro from '@tarojs/taro'
import { SessionUser } from '../types'

export const useSession = () => {
  const sessionKey = 'session'
  let session: SessionUser = Taro.getStorageSync<SessionUser>(sessionKey)

  const getSession = async (): Promise<SessionUser> => {
    if (session) {
      return Promise.resolve(session)
    }

    return new Promise((resolve, reject) => {
      Taro.getUserProfile({
        desc: '',
        success: ({ errMsg, userInfo, rawData, iv }: any) => {
          if (!userInfo) {
            console.error(errMsg)
            reject(errMsg)
          } else {
            session = {
              ...userInfo,
              ...{
                encryptedData: userInfo.encryptedData,
                iv
              }
            }
            Taro.setStorageSync(sessionKey, rawData)
            resolve(session)
          }
        },
        fail: reject
      })
    })
  }

  return {
    getSession
  }
}