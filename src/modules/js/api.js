let url = {
  hotLists: '/index/hotLists',
  banner: '/index/banner',
  topLists: '/category/topList',
  subLists: '/category/subList',
  rank: '/category/rank',
  searchLists: '/search/list',
};

let host = 'http://rap2api.taobao.org/app/mock/7058';

for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key];
  }
}

export default url;