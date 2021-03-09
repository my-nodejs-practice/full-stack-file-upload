import Vue from 'vue';
import axios from 'axios';

import { MessageBox } from 'element-ui';

export default ({ redirect }) => {
  const service = axios.create({
    baseURL: '/api'
  });

  service.interceptors.request.use(config => {
    // 接口请求之前做处理：比如添加token到header。
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token;
    }
    return config;
  });

  service.interceptors.response.use(res => {
    // 这里可以对接口返回的code状态做统一拦截处理。
    const { data } = res;
    const { code, message } = data;
    if (code === -666) {
      MessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 去登录
          redirect({ path: 'login' });
        })
        .catch(msg => {
          console.log('[取消]', msg);
        });
    }
    return data;
  });

  Vue.prototype.$http = service;
};

// export const http = service;
