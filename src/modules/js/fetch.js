import axios from 'axios';

export default function(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      let status = res.data.status;
      if (status === 200) {
        resolve(res);
      } else if (status === 100) {
        location.href = 'login.html';
        resolve(res);
      }
      reject(res);
    }).catch(error => {
      reject(error);
    })
  });
}