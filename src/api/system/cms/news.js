import request from '@/utils/request'

// 查询文章列表
export function list(query) {
    return request({
      url: '/system/cms/news/list',
      method: 'get',
      params: query
    })
  }

  
//添加文章操作
export function addNews(params){
    return request({
      url: '/system/cms/news/add',
      method: 'post',
      data:params
    })
  }

  
  //获取修改的数据
  export function getNews(id){
    return request({
      url: '/system/cms/news/edit?id='+id,
      method: 'get'
    })
  }

  //修改保存
  export function updateNews(data){
    return request({
      url :'/system/cms/news/edit',
      method:'post',
      data:data
    })
  }

  
//删除文章
export function delNews(cateId){
    return request({
      url:'/system/cms/news/delete',
      method:'delete',
      data:{ids:cateId}
    })
  }

  //获取文章模型数据
  export function loadNewsModel(cateId,newsId){
    return request({
      url:'/system/cms/news/getModelFields',
      method:'get',
      params:{cateIds:cateId,newsId:newsId}
    })
  }