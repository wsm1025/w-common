import { type } from "../util";
/**
 *
 * @param {传入的数组} arr
 * @param {删除的数据} ele 支持 基本类型 复杂类型
 * @returns new arr
 */
// 数组的拓展
// 删除数组中的某个类型的数据
function deleteArr(arr, ele) {
  if (type(arr) !== "array") throw new Error("第一个参数应为数组");
  let isBasicType =
    typeof ele === ("number" || "string" || "boolean" || "undefined" || "null");
  return arr.filter((element) =>
    isBasicType ? element !== ele : type(element) !== type(ele)
  );
}
export { deleteArr };
