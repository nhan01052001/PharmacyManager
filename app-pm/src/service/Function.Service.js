import moment from 'moment';

export default class Function {
    // copy from HieuTran Leader Team App VnResource
    static isEqual = (item1, item2, addIf) => {
        let typeItem = Object.prototype.toString.call(item1);
        // kiem tra chung type
        if (typeItem !== Object.prototype.toString.call(item2)) {
            // console.log('kiem tra chung type', 'isEqual');
            return false;
        }

        //Sau khi chung type. Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)
        if (['[object Array]', '[object Object]'].indexOf(typeItem) > -1) {
            if (!this.compare(item1, item2, addIf)) {
                // console.log('Nếu typeItem là object hoặc array thì gọi đệ quy hàm (isEqual)', 'isEqual');
                return false;
            }
        } else {
            // Nếu typeItem là function thì chuyển về string và so sánh.

            if (typeItem === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else if (typeof item1 === 'string' && item1.includes('Date')) {
                if (moment(item1).format('DD/MM/YYYY HH:mm:ss') !== moment(item2).format('DD/MM/YYYY HH:mm:ss'))
                    return false;
            } else if (item1 !== item2) {
                // console.log(item1, item2, 'Hai tham số không bằng nhau', 'isEqual');
                return false;
            }
        }
        return true;
    };

    static compare = (
        value,
        other,
        addIf = () => {
            return true;
        },
    ) => {
        // hàm kiểm tra 2 phần tử trùng nhau
        // if (addIf == null) {
        //     addIf = () => { return true }
        // }

        // console.log(addIf)
        let type = Object.prototype.toString.call(value);
        // kiem tra chung type
        if (type !== Object.prototype.toString.call(other)) {
            // console.log('kiem tra chung type', 'compare');
            return false;
        }

        // khi 2 props chung type, Kiểm tra 2 prop phải là "Array" hoặc "object"
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
            // console.log('Kiểm tra 2 prop phải là "Array" hoặc "object"', 'compare');
            return false;
        }

        let lengthValue = type === '[object Array]' ? value.length : Object.keys(value).length,
            lengthOther = type === '[object Array]' ? other.length : Object.keys(other).length;

        // Kiểm tra length bằng nhau
        if (lengthOther !== lengthValue) {
            // console.log('Kiểm tra length bằng nhau', 'compare');
            return false;
        }
        if (type == '[object Array]') {
            for (let i = 0; i < lengthValue; i++) {
                if (!this.isEqual(value[i], other[i], addIf) && addIf(value[i], other[i])) {
                    return false;
                }
            }
        } else {
            for (let key in value) {
                if (!this.isEqual(value[key], other[key], addIf) && addIf(value[key], other[key])) {
                    //&& key != 'DateUpdate'
                    return false;
                }
            }
        }

        return true;
    };

    static generateUUID = () => {
        var d = new Date().getTime(); //Timestamp
        var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) {
                //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    };

    static isValidNumberPhone = (numberPhone) => {
        return numberPhone.match(
          /((0[3|5|7|8|9])+([0-9]{8})|([+]84[3|5|7|8|9])+([0-9]{8}))\b/g
        );
    };
    
    static isValidPassword = (password) => {
        return password.match(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/
        );
    };

    static toNonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        str = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

        return str;
    }
}
