require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ImageFigure from './ImageFigure';

//获取图片相关信息
const imageDatas = require("../data/imageData.json");

class AppComponent extends React.Component {
  constructor(){
    super();
    this.state={
      centerPos : {
        left : 0,
        right :0
      },
      hPosRange :{    //水平方向取值范围
        leftSecX : [0,0],
        rightSecX : [0,0],
        y : [0,0]
      },
      vPosRange : {    //垂直方向取值范围
        x : [0,0],
        topY : [0,0]
      },
      imgsArrangeArr : []

    }
  } 

  //组件加载以后，为每张图片计算其位置范围
  componentDidMount(){
    //首先拿到舞台的大小
    const stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);

    const imgFigureDOM = this.refs.imgFigure0,
      // imgW = imgFigureDOM.scrollWidth,
      // imgH = imgFigureDOM.scrollHeight,
      imgW = 320,
      imgH = 360,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);

    this.state.centerPos = {
      left :halfStageW - halfImgW,
      top : halfStageH - halfImgH
    }

    //计算左侧，右侧区域图片排布位置的取值范围
    this.state.hPosRange.leftSecX[0] = -halfImgW;
    this.state.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.hPosRange.y[0] = -halfImgH;
    this.state.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.state.vPosRange.topY[0] = -halfImgH;
    this.state.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.vPosRange.x[0] = halfStageW -imgW;
    this.state.vPosRange.x[1] = halfStageW; 

    //默认将第一张图片放在中心
    this.reArrange(0);
  }

  //根据图片集合装配图片地址
  getImageUrl = (imageDataArr) => {
    console.log("enter")
    let imageUrlArr = [];
    for(let i=0,j=imageDataArr.length;i<j;i++){
      const singleImageUrl = imageDataArr[i];
      singleImageUrl.imageUrl = require("../images/"+singleImageUrl.fileName);
      imageUrlArr[i] = singleImageUrl;
    }
    return imageUrlArr;
  }

  /**
   * 获取区间内的一个随机值
   */
  getRangeRandom = (low,high) => {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  /**
   * 获取一个0~30°之间的一个任意正负值
   */
  get30DegRandom = () => {
    return ((Math.random() < 0.5 ? "" : "-")+ Math.ceil(Math.random()*30))
  }
  /**
   * 重新布局所有图片
   */
  reArrange = (centerIndex) => {
    const {imgsArrangeArr,centerPos,hPosRange,vPosRange} = this.state;
    const {leftSecX,rightSecX,y} = hPosRange;
    const {x,topY} = vPosRange;
    let imgsArrangeTopArr = [];
    console.log("随机数是:"+Math.random()+"=="+Math.ceil(Math.random() * 2));
    let topImgNum = Math.ceil(Math.random() * 2);    //上侧图片的个数，一个或者不取
    console.log("上侧的数是:"+topImgNum)
    let topImgSpliceIndex = 0;    //上侧图片的索引
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    //居中的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;

    //取出布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    //布局位于上侧图片
    imgsArrangeTopArr.map((option,index) => {
      imgsArrangeTopArr[index]= {
        pos : {
          top : this.getRangeRandom(topY[0],topY[1]),
          left : this.getRangeRandom(x[0],x[1])
        },
        rotate : this.get30DegRandom()
      }
    })

    //布局左右两侧图片
    for(let i=0,j = imgsArrangeArr.length,k=j/2;i<j;i++){
      let hPosRangeLORX = null;
      //前半部分是左边，后半部分是右边
      if(i < k){
        hPosRangeLORX = leftSecX;
      }else{
        hPosRangeLORX = rightSecX;
      }

      imgsArrangeArr[i] = {
        pos : {
          top : this.getRangeRandom(y[0],y[1]),
          left : this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate : this.get30DegRandom()
      }
    }

    //将上侧图片信息重新添加到图片信息数组中
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
    }

    //将中心图片重新添加到图片信息数组中
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr : imgsArrangeArr
    })
  }

  render() {
    const {imgsArrangeArr} = this.state;
    console.log("1235="+imageDatas)
    const imageDataUrls = this.getImageUrl(imageDatas)
    console.log("1234==")
    var controllerUnits = [],
    imgFigures = [];
    imageDataUrls.map((option,index) => {
      //判断如果当前图片没有设置位置信息，则将其放置在左上侧
      if(!imgsArrangeArr[index]){
        imgsArrangeArr[index] = {
          pos : {left :0, top :0},
          rotate : 0
        }
      }
      console.log("This is Map"+index)
      imgFigures.push(<ImageFigure data={option} ref={"imgFigure"+index}
      arrange ={imgsArrangeArr[index]}/>);
    });
    console.log("123456"+imageDataUrls)

    return(
      <div>
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
      </div>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
