/**
 * 表单管理组合式函数
 */

import { ref, reactive, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

/**
 * 表单管理 Hook
 * @param initialData 初始数据
 * @param rules 验证规则
 */
export function useForm<T extends Record<string, any>>(initialData: T, rules?: FormRules) {
  // ==================== 状态 ====================
  const formRef = ref<FormInstance>()
  const formData = reactive<T>({ ...initialData })
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})

  // ==================== 方法 ====================

  /**
   * 验证表单
   */
  async function validate(): Promise<boolean> {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      errors.value = {}
      return true
    } catch (error) {
      console.error('表单验证失败:', error)
      return false
    }
  }

  /**
   * 验证指定字段
   */
  async function validateField(field: string): Promise<boolean> {
    if (!formRef.value) return false

    try {
      await formRef.value.validateField(field)
      delete errors.value[field]
      return true
    } catch (error) {
      console.error(`字段 ${field} 验证失败:`, error)
      return false
    }
  }

  /**
   * 重置表单
   */
  function resetForm() {
    formRef.value?.resetFields()
    errors.value = {}
  }

  /**
   * 清空验证
   */
  function clearValidate(fields?: string | string[]) {
    formRef.value?.clearValidate(fields)
    if (fields) {
      if (Array.isArray(fields)) {
        fields.forEach((field) => delete errors.value[field])
      } else {
        delete errors.value[fields]
      }
    } else {
      errors.value = {}
    }
  }

  /**
   * 设置表单数据
   */
  function setFormData(data: Partial<T>) {
    Object.assign(formData, data)
  }

  /**
   * 重置表单数据到初始值
   */
  function resetFormData() {
    Object.assign(formData, initialData)
  }

  /**
   * 获取表单数据
   */
  function getFormData(): T {
    return { ...formData } as T
  }

  /**
   * 设置加载状态
   */
  function setLoading(value: boolean) {
    loading.value = value
  }

  /**
   * 设置错误信息
   */
  function setErrors(newErrors: Record<string, string>) {
    errors.value = { ...errors.value, ...newErrors }
  }

  /**
   * 清空错误信息
   */
  function clearErrors() {
    errors.value = {}
  }

  /**
   * 提交表单
   */
  async function submit<R>(
    submitFn: (data: T) => Promise<R>,
    options?: {
      beforeSubmit?: () => void | Promise<void>
      afterSubmit?: (result: R) => void | Promise<void>
      onError?: (error: any) => void
    }
  ): Promise<R | null> {
    // 验证表单
    const isValid = await validate()
    if (!isValid) {
      return null
    }

    loading.value = true
    try {
      // 提交前回调
      if (options?.beforeSubmit) {
        await options.beforeSubmit()
      }

      // 执行提交
      const result = await submitFn(getFormData())

      // 提交后回调
      if (options?.afterSubmit) {
        await options.afterSubmit(result)
      }

      return result
    } catch (error) {
      console.error('表单提交失败:', error)
      if (options?.onError) {
        options.onError(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    formRef,
    formData: toRefs(formData),
    loading,
    errors,
    rules,
    // 方法
    validate,
    validateField,
    resetForm,
    clearValidate,
    setFormData,
    resetFormData,
    getFormData,
    setLoading,
    setErrors,
    clearErrors,
    submit,
  }
}
