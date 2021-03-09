<template>
  <div class="uc-container">
    <h2>用户中心</h2>
    <el-form label-width="100px" class="uc-form">
      <el-form-item label="昵称">
        <span>{{ userInfo.nickname }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ userInfo.email }}</span>
      </el-form-item>
    </el-form>
    <hr />
    <div ref="drag" id="drag">
      <input type="file" @change="handleUpload" />
    </div>
    <div class="progress">
      <el-progress :percentage="progress"></el-progress>
    </div>
    <el-button type="primary" @click="upload">上传</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      progress: 0,
      userInfo: {}
    };
  },
  mounted() {
    // 获取用户信息;
    this.$http.get('/user/info').then(res => {
      console.log('[user info]', res);
      this.userInfo = res.data;
    });
    const drag = this.$refs.drag;
    // drag.addEventListener('dragenter', e => {
    //   drag.style.borderColor = 'red';
    //   e.preventDefault();
    // });
    drag.addEventListener('dragover', e => {
      e.preventDefault();
      drag.style.borderColor = 'green';
      drag.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    });
    drag.addEventListener('dragleave', e => {
      e.preventDefault();
      drag.style.borderColor = '#e5e5e5';
      drag.style.backgroundColor = '';
    });
    drag.addEventListener('drop', e => {
      e.preventDefault();
      drag.style.borderColor = '#e5e5e5';
      drag.style.backgroundColor = '';
      console.log('e.dataTransfer', e.dataTransfer);
      const fileList = e.dataTransfer.files;
      this.file = fileList[0];
    });
  },
  methods: {
    handleUpload(e) {
      console.log(e);
      const file = e.target.files[0];
      this.file = file;
    },
    upload() {
      const fd = new FormData();
      fd.append('name', this.file.name);
      fd.append('file', this.file);
      // {
      //   headers: { 'content-type': 'multipart/form-data' }
      // }
      this.$http.post('/uploadFile', fd, {
        onUploadProgress: e => {
          this.progress = Number(((e.loaded / e.total) * 100).toFixed(0));
          // console.log(e, this.progress);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.uc-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
}
#drag {
  border: 2px dashed #e5e5e5;
  margin: 15px 0;
  padding: 30px;
}
.progress {
  margin: 10px 0;
}
</style>
