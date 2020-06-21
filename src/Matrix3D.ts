const cos = Math.cos
const sin = Math.sin
const tan = Math.tan
const floor = Math.floor
const sqrt = Math.sqrt
const deg2PI = (deg:number) => Math.PI / 180 * deg

export class Matrix3D {
    private arr: number[] = [];
    private row = 4
    private cols = 4

    constructor(option?: number[] | Matrix3D | {
        translate?: { x: number, y: number, z: number },
        scale?: { x: number, y: number, z: number },
        rotate?: { x: number, y: number, z: number },
        skew?: { x: number, y: number }
    }) {
        if (!option) {
            this.init()
        } else if (option instanceof Matrix3D) {
            this.arr = option.arr;
        } else if (Array.isArray(option)) {
            if (option.length != 16) {
                throw new Error("option.length must 16")
            } else {
                this.arr = option
            }
        } else if (typeof option == 'object') {
            let matrix = new Matrix3D();
            if (option.translate) {
                matrix.translate(option.translate.x || 0, option.translate.x || 0, option.translate.x || 0)
            }
            if (option.scale) {
                matrix.scaleX(option.scale.x || 1).scaleY(option.scale.y || 1).scaleZ(option.scale.z || 1)
            }
            if (option.rotate) {
                matrix.rotateX(option.rotate.x || 0).rotateY(option.rotate.y || 0).rotateZ(option.rotate.z || 0)
            }
            if (option.skew) {
                matrix.skewX(option.skew.x || 0).skewY(option.skew.y || 0);
            }
            this.arr = matrix.arr;
        }
    }

    init() { // 初始化一个项链矩阵
        var allTotal = this.row * this.cols
        // 总项目数量
        for (var i = 0; i < allTotal; i++) {
            var row = floor(i / this.cols)
            if (row === i % this.cols) {
                this.arr.push(1)
            } else {
                this.arr.push(0)
            }
        }
    }

    multiply(matrix: Matrix3D): Matrix3D {
        // 矩阵乘法
        const arr = this.arr
        const b = matrix.arr
        var c00 = arr[0] * b[0] + arr[1] * b[4] + arr[2] * b[8] + arr[3] * b[12]
        var c01 = arr[0] * b[1] + arr[1] * b[5] + arr[2] * b[9] + arr[3] * b[13]
        var c02 = arr[0] * b[2] + arr[1] * b[6] + arr[2] * b[10] + arr[3] * b[14]
        var c03 = arr[0] * b[3] + arr[1] * b[7] + arr[2] * b[11] + arr[3] * b[15]

        var c10 = arr[4] * b[0] + arr[5] * b[4] + arr[6] * b[8] + arr[7] * b[12]
        var c11 = arr[4] * b[1] + arr[5] * b[5] + arr[6] * b[9] + arr[7] * b[13]
        var c12 = arr[4] * b[2] + arr[5] * b[6] + arr[6] * b[10] + arr[7] * b[14]
        var c13 = arr[4] * b[3] + arr[5] * b[7] + arr[6] * b[11] + arr[7] * b[15]

        var c20 = arr[8] * b[0] + arr[9] * b[4] + arr[10] * b[8] + arr[11] * b[12]
        var c21 = arr[8] * b[1] + arr[9] * b[5] + arr[10] * b[9] + arr[11] * b[13]
        var c22 = arr[8] * b[2] + arr[9] * b[6] + arr[10] * b[10] + arr[11] * b[14]
        var c23 = arr[8] * b[3] + arr[9] * b[7] + arr[10] * b[11] + arr[11] * b[15]

        var c30 = arr[12] * b[0] + arr[13] * b[4] + arr[14] * b[8] + arr[15] * b[12]
        var c31 = arr[12] * b[1] + arr[13] * b[5] + arr[14] * b[9] + arr[15] * b[13]
        var c32 = arr[12] * b[2] + arr[13] * b[6] + arr[14] * b[10] + arr[15] * b[14]
        var c33 = arr[12] * b[3] + arr[13] * b[7] + arr[14] * b[11] + arr[15] * b[15]

        this.arr = [ // 返回矩阵
            c00, c01, c02, c03,
            c10, c11, c12, c13,
            c20, c21, c22, c23,
            c30, c31, c32, c33
        ]
        return this
    }

    scale(s: number) {
        return this.scaleX(s).scaleY(s).scaleZ(s)
    }

    scaleX(s: number) {
        var scaleMatrix = new Matrix3D([
            s, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(scaleMatrix)
    }

    scaleY(s: number) {
        var scaleMatrix = new Matrix3D([
            1, 0, 0, 0,
            0, s, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(scaleMatrix)
    }

    scaleZ(s: number) {
        var scaleMatrix = new Matrix3D([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, s, 0,
            0, 0, 0, 1
        ])
        return this.multiply(scaleMatrix)
    }

    rotate(o: number) {
        return this.rotateZ(o)
    }

    rotateX(o: number) {
        const d2pi = deg2PI(o)
        const cosb = cos(d2pi)
        const sinb = sin(d2pi)
        var rotateMatrix = new Matrix3D([
            1, 0, 0, 0,
            0, cosb, sinb, 0,
            0, -sinb, cosb, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotateMatrix)
    }

    rotateY(o: number) {
        const d2pi = deg2PI(o)
        const cosb = cos(d2pi)
        const sinb = sin(d2pi)
        var rotateMatrix = new Matrix3D([
            cosb, 0, -sinb, 0,
            0, 1, 0, 0,
            sinb, 0, cosb, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotateMatrix)
    }

    /**
     * 绕Z轴旋转
     * @param  {Number} z 旋转角度
     * @return {Matrix}   返回旋转后的矩阵
     */
    rotateZ(z: number) {
        const d2pi = deg2PI(z)
        const cosb = cos(d2pi)
        const sinb = sin(d2pi)
        var rotateMatrix = new Matrix3D([
            cosb, sinb, 0, 0,
            -sinb, cosb, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotateMatrix)
    }

    translate(x = 0, y = 0, z = 0) {
        var translateMatrix = new Matrix3D([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ])
        return this.multiply(translateMatrix)
    }

    translateX(x: number) {
        var translateMatrix = new Matrix3D([
            1, 0, 0, x,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(translateMatrix)
    }

    translateY(y: number) {
        var translateMatrix = new Matrix3D([
            1, 0, 0, 0,
            0, 1, 0, y,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(translateMatrix)
    }

    translateZ(z: number) {
        var translateMatrix = new Matrix3D([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, z,
            0, 0, 0, 1
        ])
        return this.multiply(translateMatrix)
    }

    skew(degx = 0, degy = 0) {
        const d2pix = deg2PI(degx)
        const d2piy = deg2PI(degy)
        const tanbx = tan(d2pix)
        const tanby = tan(d2piy)
        var skewMatrix = new Matrix3D([
            1, tanbx, 0, 0,
            tanby, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(skewMatrix)
    }

    skewX(deg: number) {
        const d2pi = deg2PI(deg)
        const tanb = tan(d2pi)
        var skewMatrix = new Matrix3D([
            1, tanb, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(skewMatrix)
    }

    skewY(deg: number) {
        const d2pi = deg2PI(deg)
        const tanb = tan(d2pi)
        var skewMatrix = new Matrix3D([
            1, 0, 0, 0,
            tanb, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(skewMatrix)
    }

    toString(): string {
        const a = this.arr
        let out: number[] = []
        for (var i = 0; i < 4; i++) {
            out = out.concat([a[i], a[i + 4], a[i + 8], a[i + 12]])
        }
        return `matrix3d(${out.join(',')})`
    }
}
