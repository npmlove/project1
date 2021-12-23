import {asyncRoutes} from "@/router/config"
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
 function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta.roles.includes(role))
    } else {
      return true
    }
  }
  
  /**
   * Filter asynchronous routing tables by recursion
   * @param routes asyncRoutes
   * @param roles
   */
  export function filterAsyncRoutes(routes, roles) {
    const res = []
  
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
  
    return res
  }

  function pathArr(asyncRoutes){
    const arr = []
    asyncRoutes.forEach(item=>{
      item.children.forEach(v=>{
        arr.push(item.path + "/" + v.path)
      })
    })
    return arr
  }

  export const whiteList = pathArr(asyncRoutes)