<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
      class="register-form"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          v-model="form.pass"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="form.checkPass"
          type="password"
          autocomplete="off"
          placeholder="请输入确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" class="captcha-container">
        <el-input v-model="form.captcha" autocomplete="off" placeholder="请输入验证码"></el-input>
        <span class="captcha-wrap">
          <img :src="captcha" alt="" @click="randomCaptcha" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">注册</el-button>
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
        if (this.form.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        email: 'lizhigao1231@126.com',
        nickname: 'lee',
        pass: 'a123456',
        checkPass: 'a123456',
        captcha: ''
      },
      rules: {
        email: [{ type: 'email', required: true, message: '请输入正确邮箱' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        pass: [{ validator: validatePass, required: true, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, required: true, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码' }]
      },
      captcha: '/api/captcha'
    };
  },
  methods: {
    submitForm() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const { email, nickname, pass, captcha } = this.form;
          this.$http
            .post('/user/register', {
              email,
              nickname,
              pass: md5(pass),
              captcha
            })
            .then(res => {
              if (res.code === 0) {
                this.$alert('注册成功', '成功', {
                  confirmButtonText: '去登录',
                  callback: action => {
                    this.$router.push('/login');
                  }
                });
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
}
</style>
