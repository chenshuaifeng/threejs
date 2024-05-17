/**
 * <p> 获取加载图片地址 </p>
 * examples: /src/assets/bg/bg.png
 * @param url: string
 *
 */
export const useFile = (url: string) => {
  const modules: Record<string, any> = import.meta.glob("@/assets/images/**/*.{png,svg,jpg,jpeg}", { eager: true })
  return modules
}
