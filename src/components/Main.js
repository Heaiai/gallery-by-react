require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//获取图片相关信息
const imageDatas = require("../data/imageData.json");

//根据图片集合装配图片地址
getImageUrl = (imageDataArr) => {
  let imageUrlArr = [];
  for(let i=0,j=imageDataArr.length;i<j;i++){
    const singleImageUrl = imageDataArr[i];
    singleImageUrl.imageUrl = require("../images/"+singleImageUrl.fileName);
    imageUrlArr[i] = singleImageUrl;
  }
  return imageUrlArr;
}

const imageDataUrls = getImageUrl(imageDatas)

class AppComponent extends React.Component {


  render() {
    <section className="stage">
      <section className="img-sec">

      </section>
      <nav className="controller-nav">

      </nav>

    </section>
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
