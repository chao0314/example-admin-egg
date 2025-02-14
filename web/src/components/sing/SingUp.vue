<template>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane :label="locale.username" name="username">
      <el-form :rules="rules" ref="formRef"
               label-position="left"
               label-width="100px"
               :model="formData"
               style="max-width: 460px"
      >
        <el-form-item :label="locale.username" prop="username">
          <el-input v-model="formData.username"/>
        </el-form-item>
        <el-form-item :label="locale.password" prop="password">
          <el-input type="password" v-model="formData.password"/>
        </el-form-item>
        <el-form-item :label="locale.password2" prop="password2">
          <el-input type="password" v-model="formData.password2"/>
        </el-form-item>
        <el-form-item :label="locale.verificationCode" prop="verificationCode">
          <el-row :gutter="4">
            <el-col :span="10">
              <el-input v-model="formData.verificationCode"/>
            </el-col>
            <el-col :span="10">
              <captcha :src="captchaRef" @captcha="handleCaptcha"></captcha>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="locale.emailOrPhone" name="emailOrPhone">
      <el-form :rules="rules" ref="emailOrPhoneFromRef"
               label-position="left"
               label-width="100px"
               :model="emailOrPhoneFromData"
               style="max-width: 460px"
      >
        <el-form-item :label="locale.account" prop="account">
          <el-input v-model="emailOrPhoneFromData.account"/>
        </el-form-item>
        <el-form-item :label="locale.password" prop="password">
          <el-input type="password" v-model="emailOrPhoneFromData.password"/>
        </el-form-item>
        <el-form-item :label="locale.dynamicCode" prop="dynamicCode">
          <el-row :gutter="4">
            <el-col :span="14">
              <el-input v-model="emailOrPhoneFromData.dynamicCode"/>
            </el-col>
            <el-col :span="6">
              <dynamic-code :countdown="300" @send-code="handleSendCode"></dynamic-code>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <div class="sing-in__button">
    <el-button type="primary" @click="handleSingUp">
      {{ locale.singUp }}
    </el-button>

  </div>
  <p class="sing-in" @click="handleToSingIn">去登录</p>

</template>

<script setup lang="ts">
// const props = withDefaults(defineProps<{}>(), {})
import {inject, onMounted, reactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import useRules from "@/rules";
import type {FormInstance} from "element-plus";

import {useHomeStore} from "@/stores/home";
import Captcha from '../common/Captcha.vue';
import DynamicCode from '../common/DynamicCode.vue';
import {ElMessage} from "element-plus";
import router from "@/router";

const homeStore = useHomeStore();
const rules = useRules();
const locale = inject<Locale>('locale');
const activeName = ref('username');
const formRef = ref<FormInstance>();
const emailOrPhoneFromRef = ref<FormInstance>();
const captchaRef = ref('');
let tabIndex = 0;

const formData = reactive({
  username: '',
  password: '',
  password2: '',
  verificationCode: ''
})

const emailOrPhoneFromData = reactive({
  account: '',
  password: '',
  verificationCode: '',
  dynamicCode: ''
})


const handleTabClick = ({index = 0}) => {
  captchaRef.value = '';
  tabIndex = index;
}

const handleSendCode = () => {

  const {account} = emailOrPhoneFromData;

  if (account) {
    const isPhone = /^(\+86|86)?\d{11}$/.test(account);
    if (isPhone) homeStore.sendSmsAction({phone: account});
    else homeStore.sendMailAction({to: account});


  }

}

const handleSingUp = async () => {

  if (tabIndex === 0) {

    formRef.value?.validate(async (isValid: boolean) => {

      const {username, password, password2, verificationCode} = formData;

      if (isValid) {

        if (password !== password2) return ElMessage({
          type: 'error',
          message: locale?.passwordConfirm,
          offset: 100
        })
        const {data} = await homeStore.verifyCaptchaAction({captcha: verificationCode});

        if (data) {

          homeStore.singUpAction({username, password}).then(() => router.push('/sing/in'))

        } else ElMessage({
          type: 'error',
          message: locale?.captchaError,
          offset: 100
        })


      }

    })


  } else {

    const {account, password, dynamicCode: code} = emailOrPhoneFromData;

    const isPhone = /^(\+86|86)?\d{11}$/.test(account);

    emailOrPhoneFromRef.value?.validate(async isValid => {

          if (isValid) {

            if (isPhone) {

              homeStore.singUpPhoneAction({phone: account, password, code}).then(() => router.push('/sing/in'));

            } else {

              homeStore.singUpEmailAction({email: account, password, code}).then(() => router.push('/sing/in'));

            }

          }


        }
    )


  }


}


const handleCaptcha = () => homeStore.getCaptchaAction().then(({data}) => captchaRef.value = data);


const handleToSingIn = () => {

  router.push('/sing/in');
}

</script>

<style scoped>

.sing-in__button {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

.sing-in {

  margin: 2px 0 0;
  text-align: center;
  font-size: 12px;
  cursor: pointer;

}

</style>