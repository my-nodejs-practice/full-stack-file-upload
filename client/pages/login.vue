<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
      class="login-form"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          v-model="form.pass"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" class="captcha-container">
        <el-input v-model="form.captcha" autocomplete="off" placeholder="请输入验证码"></el-input>
        <span class="captcha-wrap">
          <img :src="captcha" alt="" />
        </span>
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="emailcode" class="captcha-container">
        <el-input
          v-model="form.emailcode"
          autocomplete="off"
          placeholder="请输入邮箱验证码"
        ></el-input>
        <el-button type="primary" :disabled="send.timer > 0" @click="sendEmailCode">
          {{ sendText }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5';
export default {
  layout: 'blank',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      send: {
        timer: 0
      },
      form: {
        email: 'lizhigao@021.com',
        pass: 'a123456',
        captcha: '',
        emailcode: ''
      },
      rules: {
        email: [{ type: 'email', required: true, message: '请输入正确邮箱' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        pass: [{ validator: validatePass, required: true, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码' }],
        emailcode: [{ required: true, message: '请输入邮箱验证码' }]
      },
      captcha: '/api/captcha'
    };
  },
  computed: {
    sendText() {
      if (this.send.timer <= 0) {
        return `发送`;
      }
      return `${this.send.timer}s后发送`;
    }
  },
  methods: {
    sendEmailCode() {
      this.$http.get('/emailCode?email=' + this.form.email);
      this.send.timer = 10;
      const timer = setInterval(() => {
        this.send.timer--;
        if (this.send.timer <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const { email, nickname, pass, captcha, emailcode } = this.form;
          this.$http
            .post('/user/login', {
              email,
              nickname,
              pass: md5(pass),
              captcha,
              emailcode
            })
            .then(res => {
              if (res.code === 0) {
                localStorage.setItem('token', res.data.token);
                this.$message.success('登录成功');
                setTimeout(() => {
                  // this.$router.push('/');
                  this.$router.push('/uc');
                }, 500);
              } else {
                this.$message.error(res.message);
              }
            });
        } else {
          console.log('校验失败');
        }
      });
    },
    randomCaptcha() {
      this.captcha = this.captcha.split('?')[0] + '?_t=' + Date.now();
      // +
      // Number(String(Math.random()).slice(2))
      //   .toString(36)
      //   .slice(-4);
    }
  }
};
</script>

<style lang="scss" scoped>
.captcha-container {
  .el-input {
    width: 180px;
  }
  .captcha-wrap {
    position: absolute;
    right: 0;
    width: 120px;
    height: 40px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
  .el-button {
    position: absolute;
    right: 0;
    width: 110px;
    height: 40px;
  }
}
</style>
