<template>
  <div class="personal-panel">
    <div class="personal-desc" :style="{'background':this.$store.state.app.themeColor}">
      <div class="avatar-container">
        <img class="avatar" :src="require('@/assets/user.png')"/>
      </div>
      <div class="name-role">
        <span class="sender">{{ user.name }} - {{ user.role }}</span>
      </div>
      <div class="register-info">
          <span class="register-info">
            <i class="fa fa-clock-o"></i>
            {{ user.registerInfo }}
          </span>
      </div>
    </div>
    <div class="personal-relation">
      <span class="relation-item">followers</span>
      <span class="relation-item">watches</span>
      <span class="relation-item">friends</span>
    </div>
    <div class="main-operation">
        <span class="main-operation-item">
          <el-button size="small" icon="fa fa-male"> 个人中心</el-button>
        </span>
      <span class="main-operation-item">
          <el-button size="small" icon="fa fa-key"> 修改密码</el-button>
        </span>
    </div>
    <div class="other-operation">
      <div class="other-operation-item">
        <i class="fa fa-eraser"></i>
        清除缓存
      </div>
      <div class="other-operation-item">
        <i class="fa fa-user"></i>
        在线人数
      </div>
      <div class="other-operation-item">
        <i class="fa fa-bell"></i>
        访问次数
      </div>
      <div class="other-operation-item">
        <i class="fa fa-undo"></i>
        备份恢复
      </div>
    </div>
    <div class="personal-footer" @click="logout">
      <i class="fa fa-sign-out"></i>
      注销
    </div>
  </div>
</template>

<script>
import * as auth from '@/utils/auth'

export default {
  name: 'PersonalPanel',
  components: {},
  props: {
    user: {
      type: Object,
      default: {
        name: "admin",
        avatar: "@/assets/user.png",
        role: "超级管理员",
        registerInfo: "注册时间：2021-12-25 "
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 退出登录
    logout: function () {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      }).then(() => {
        auth.logout()
        this.$router.push("/login")
      }).catch(() => {
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 280px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  background: rgba(182, 172, 172, 0.1);
  margin: -14px;
}

.personal-desc {
  padding: 15px;
  color: #fff;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}

.name-role {
  font-size: 16px;
  padding: 5px;
}

.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}

.relation-item {
  padding: 5px;
}

.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}

.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.main-operation-item {
  margin: 15px;
}

.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.other-operation-item {
  padding: 12px;
}

.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}

.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>
