import {Matrix3D} from './Matrix3D'

let m1 = new Matrix3D();
m1.translateX(10);
m1.translateY(30);
//transform: translate3d(10px, 30px, 0px);
console.log(m1.toString())
