import React from 'react';

class ImageFigure extends React.Component{

    render(){
        const {pos,rotate} = this.props.arrange;
        console.log("ImageFigure"+this.props.data)
        let styleObj= {};
        if(pos){
            styleObj = pos
        }
        //如果图片的旋转角度有值并且不为0，添加旋转角度
        if(rotate){
            (["-moz-","-ms-","-webkit-",""]).map((option,index) => {
                styleObj[option+"transform"] = 'rotate('+rotate+'deg)';
            })
        }
        console.log("this pos is :"+styleObj.left+"=="+styleObj.top)
        return(
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title} className="img-photo"/>
                <figcaption>
                    <h2 title="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        )
    }
}

export default ImageFigure